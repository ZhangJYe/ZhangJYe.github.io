/**
 * Notion → Hexo Markdown 单向同步脚本
 *
 * 安全原则：
 * - 只同步 Status=Published/已发布 且 Sync=true 的页面
 * - 不覆盖已有文件
 * - 不删除本地文章
 * - 不做双向同步
 */

const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────

function loadConfig() {
  require('dotenv').config({ quiet: true });

  const token = process.env.NOTION_TOKEN;
  const dataSourceId = normalizeNotionId(process.env.NOTION_DATA_SOURCE_ID);
  const databaseId = normalizeNotionId(process.env.NOTION_DATABASE_ID);

  if (!token) {
    console.error('[ERROR] NOTION_TOKEN is required in .env');
    process.exit(1);
  }

  if (!dataSourceId && !databaseId) {
    console.error('[ERROR] NOTION_DATA_SOURCE_ID or NOTION_DATABASE_ID is required in .env');
    process.exit(1);
  }

  return {
    token,
    dataSourceId,
    databaseId,
    statusValues: parseListEnv(process.env.NOTION_STATUS_VALUES, ['Published', '已发布']),
    postsDir: path.join(__dirname, '../../source/_posts'),
  };
}

function parseListEnv(raw, fallback) {
  if (!raw) return fallback;
  const values = raw.split(',').map(item => item.trim()).filter(Boolean);
  return values.length ? values : fallback;
}

function normalizeNotionId(raw) {
  if (!raw) return '';

  const withoutQuery = String(raw).trim().split(/[?#]/)[0];
  const matches = withoutQuery.match(/[0-9a-fA-F]{32}|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g);
  if (!matches || matches.length === 0) return '';

  const compact = matches[matches.length - 1].replace(/-/g, '').toLowerCase();
  if (compact.length !== 32) return '';

  return [
    compact.slice(0, 8),
    compact.slice(8, 12),
    compact.slice(12, 16),
    compact.slice(16, 20),
    compact.slice(20),
  ].join('-');
}

function shortId(id) {
  if (!id) return '(not set)';
  return `${id.slice(0, 8)}...${id.slice(-6)}`;
}

// ─── Notion Client ───────────────────────────────────────

let Client;
let LogLevel;
try {
  ({ Client, LogLevel } = require('@notionhq/client'));
} catch {
  console.error('[ERROR] @notionhq/client not installed. Run: npm install @notionhq/client');
  process.exit(1);
}

function initClient(config) {
  return new Client({ auth: config.token, logLevel: LogLevel.ERROR });
}

// ─── Data Source Resolution ─────────────────────────────

async function resolveDataSource(client, config) {
  let dataSourceError = null;

  if (config.dataSourceId) {
    try {
      const dataSource = await client.dataSources.retrieve({
        data_source_id: config.dataSourceId,
      });
      console.log(`[sync] Using data source ${shortId(dataSource.id)}`);
      return dataSource;
    } catch (err) {
      dataSourceError = err;
      if (!config.databaseId || err.code !== 'object_not_found') {
        throwNotionTargetError(err, config);
      }
      console.warn(`[WARN] NOTION_DATA_SOURCE_ID ${shortId(config.dataSourceId)} is not accessible, trying NOTION_DATABASE_ID...`);
    }
  }

  if (config.databaseId) {
    try {
      const database = await client.databases.retrieve({
        database_id: config.databaseId,
      });
      const dataSources = database.data_sources || [];
      if (dataSources.length === 0) {
        throw new Error(`Database ${shortId(database.id)} has no data_sources in the API response`);
      }

      const dataSourceId = dataSources[0].id;
      const dataSource = await client.dataSources.retrieve({
        data_source_id: dataSourceId,
      });
      console.log(`[sync] Resolved database ${shortId(database.id)} to data source ${shortId(dataSource.id)}`);
      return dataSource;
    } catch (err) {
      throwNotionTargetError(dataSourceError || err, config);
    }
  }

  throwNotionTargetError(dataSourceError || new Error('No Notion target configured'), config);
}

function throwNotionTargetError(err, config) {
  const message = [
    'Notion target is not accessible.',
    `Checked NOTION_DATA_SOURCE_ID: ${shortId(config.dataSourceId)}`,
    `Checked NOTION_DATABASE_ID: ${shortId(config.databaseId)}`,
    `Notion API message: ${err.message}`,
    '',
    'Fix checklist:',
    '1. Open the original full-page Notion database, not a linked database view.',
    '2. Click ... → Connections, then add your integration.',
    '3. Copy the Data Source ID into NOTION_DATA_SOURCE_ID, or copy the Database ID into NOTION_DATABASE_ID.',
    '4. If you changed the database after creating the token, re-check that the integration is still connected.',
  ].join('\n');

  const wrapped = new Error(message);
  wrapped.code = err.code;
  throw wrapped;
}

// ─── Schema Resolution ──────────────────────────────────

const PROPERTY_ALIASES = {
  title: ['Title', 'Name', '文章标题', '标题'],
  slug: ['Slug', '文件名'],
  date: ['Date', '发布日期', 'Publish Date', 'Published At'],
  tags: ['Tags', '标签'],
  categories: ['Categories', 'Category', '分类'],
  description: ['Description', '摘要', 'Summary'],
  status: ['Status', '状态'],
  sync: ['Sync', '是否同步'],
  toc: ['Toc', 'TOC'],
  sticky: ['Sticky'],
};

const REQUIRED_PROPERTIES = ['title', 'slug', 'date', 'tags', 'categories', 'status', 'sync'];

function resolveSchemaProperties(schema) {
  const resolved = {};

  for (const key of Object.keys(PROPERTY_ALIASES)) {
    resolved[key] = findPropertyName(schema, PROPERTY_ALIASES[key]);
  }

  const missing = REQUIRED_PROPERTIES.filter(key => !resolved[key]);
  if (missing.length > 0) {
    const available = Object.keys(schema).sort().join(', ') || '(none)';
    const expected = missing
      .map(key => `${key}: ${PROPERTY_ALIASES[key].join(' / ')}`)
      .join('; ');
    throw new Error(`Notion database schema is missing required properties. Missing ${expected}. Available: ${available}`);
  }

  return resolved;
}

function findPropertyName(schema, aliases) {
  for (const alias of aliases) {
    if (schema[alias]) return alias;
  }

  const lowerMap = new Map(Object.keys(schema).map(name => [name.toLowerCase(), name]));
  for (const alias of aliases) {
    const actual = lowerMap.get(alias.toLowerCase());
    if (actual) return actual;
  }

  return '';
}

function getSchemaType(schema, propName) {
  return schema[propName]?.type;
}

// ─── Query with Pagination ───────────────────────────────

async function queryDataSourceWithPagination(client, config, dataSource, props) {
  const filter = buildPublishedFilter(dataSource.properties, props, config.statusValues);

  const allResults = [];
  let cursor = undefined;

  while (true) {
    const response = await client.dataSources.query({
      data_source_id: dataSource.id,
      filter,
      start_cursor: cursor,
      page_size: 100,
    });

    allResults.push(...response.results);

    if (!response.has_more) break;
    cursor = response.next_cursor;
  }

  return allResults;
}

function buildPublishedFilter(schema, props, statusValues) {
  const statusProperty = schema[props.status];
  const statusType = statusProperty?.type;
  const statusFilterType = statusType === 'status' ? 'status' : 'select';
  const availableStatusOptions = getOptionNames(statusProperty);
  const effectiveStatusValues = availableStatusOptions.length
    ? statusValues.filter(value => availableStatusOptions.includes(value))
    : statusValues;

  if (effectiveStatusValues.length === 0) {
    throw new Error(
      `No configured published status matches property "${props.status}". ` +
      `Configured values: ${statusValues.map(value => `"${value}"`).join(', ')}. ` +
      `Available options: ${availableStatusOptions.map(value => `"${value}"`).join(', ')}. ` +
      'Set NOTION_STATUS_VALUES in .env to match your Notion status option.'
    );
  }

  const statusFilters = effectiveStatusValues.map(value => ({
    property: props.status,
    [statusFilterType]: { equals: value },
  }));

  return {
    and: [
      statusFilters.length === 1 ? statusFilters[0] : { or: statusFilters },
      { property: props.sync, checkbox: { equals: true } },
    ],
  };
}

function getOptionNames(property) {
  if (!property) return [];
  const options = property[property.type]?.options;
  return Array.isArray(options) ? options.map(option => option.name) : [];
}

// ─── Fetch Blocks Recursively ────────────────────────────

async function fetchBlocksRecursively(client, blockId) {
  const blocks = [];
  let cursor = undefined;

  while (true) {
    const response = await client.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });

    for (const block of response.results) {
      if (block.has_children) {
        try {
          block._children = await fetchBlocksRecursively(client, block.id);
        } catch (err) {
          console.warn(`  [WARN] Failed to fetch children of block ${block.id}: ${err.message}`);
          block._children = [];
        }
      }
      blocks.push(block);
    }

    if (!response.has_more) break;
    cursor = response.next_cursor;
  }

  return blocks;
}

// ─── Rich Text → Markdown ────────────────────────────────

function richTextToMarkdown(richTextArray) {
  if (!richTextArray || richTextArray.length === 0) return '';

  let result = '';
  for (const rt of richTextArray) {
    try {
      let text = rt.plain_text || '';

      if (rt.annotations?.code) text = `\`${text}\``;
      if (rt.annotations?.bold) text = `**${text}**`;
      if (rt.annotations?.italic) text = `*${text}*`;
      if (rt.annotations?.strikethrough) text = `~~${text}~~`;
      if (rt.text?.link?.url) text = `[${text}](${rt.text.link.url})`;

      result += text;
    } catch {
      result += rt.plain_text || '';
    }
  }

  return result;
}

// ─── Block → Markdown ────────────────────────────────────

function blocksToMarkdown(blocks, indent = 0, context = {}) {
  const lines = [];
  const prefix = '  '.repeat(indent);
  let orderedIndex = 0;

  for (const block of blocks) {
    try {
      const md = blockToMarkdown(block, indent, context);
      if (md !== null) {
        if (block.type === 'numbered_list_item') {
          orderedIndex++;
          lines.push(`${prefix}${orderedIndex}. ${md}`);
        } else {
          orderedIndex = 0;
          lines.push(prefix + md);
        }
      }
    } catch {
      lines.push(`${prefix}<!-- [SKIP] unsupported block: ${block.type} -->`);
    }
  }

  return lines.join('\n');
}

function blockToMarkdown(block, indent, context) {
  const data = block[block.type];
  if (!data) return `<!-- [SKIP] unsupported block: ${block.type} -->`;

  const children = block._children;

  switch (block.type) {
    case 'paragraph':
      return richTextToMarkdown(data.rich_text);

    case 'heading_1':
      return `# ${richTextToMarkdown(data.rich_text)}`;
    case 'heading_2':
      return `## ${richTextToMarkdown(data.rich_text)}`;
    case 'heading_3':
      return `### ${richTextToMarkdown(data.rich_text)}`;

    case 'bulleted_list_item': {
      const text = `- ${richTextToMarkdown(data.rich_text)}`;
      if (children?.length) {
        return text + '\n' + blocksToMarkdown(children, indent + 1, context);
      }
      return text;
    }

    case 'numbered_list_item': {
      const text = richTextToMarkdown(data.rich_text);
      if (children?.length) {
        return text + '\n' + blocksToMarkdown(children, indent + 1, context);
      }
      return text;
    }

    case 'to_do': {
      const checked = data.checked ? 'x' : ' ';
      return `- [${checked}] ${richTextToMarkdown(data.rich_text)}`;
    }

    case 'toggle': {
      const text = `<details><summary>${richTextToMarkdown(data.rich_text)}</summary>`;
      if (children?.length) {
        return text + '\n\n' + blocksToMarkdown(children, indent + 1, context) + '\n</details>';
      }
      return text + '\n</details>';
    }

    case 'code': {
      const lang = data.language || '';
      const code = richTextToMarkdown(data.rich_text);
      return '```' + lang + '\n' + code + '\n```';
    }

    case 'quote': {
      const text = `> ${richTextToMarkdown(data.rich_text)}`;
      if (children?.length) {
        const childLines = blocksToMarkdown(children, 0, context).split('\n');
        return text + '\n' + childLines.map(l => `> ${l}`).join('\n');
      }
      return text;
    }

    case 'divider':
      return '---';

    case 'bookmark':
      return `[${data.url}](${data.url})`;

    case 'image': {
      const url = data.external?.url || data.file?.url || '';
      const caption = data.caption?.length ? richTextToMarkdown(data.caption) : 'image';
      if (data.file?.url && context.slug) {
        trackImageWarning(context.slug);
      }
      return `![${caption}](${url})`;
    }

    case 'callout': {
      const icon = data.icon?.emoji || '💡';
      const text = `> ${icon} ${richTextToMarkdown(data.rich_text)}`;
      if (children?.length) {
        const childLines = blocksToMarkdown(children, 0, context).split('\n');
        return text + '\n' + childLines.map(l => `> ${l}`).join('\n');
      }
      return text;
    }

    case 'table': {
      if (children?.length) {
        const rows = children.filter(r => r.type === 'table_row');
        if (rows.length === 0) return '';
        const mdRows = rows.map(row => {
          const cells = row.table_row.cells.map(cell => richTextToMarkdown(cell));
          return `| ${cells.join(' | ')} |`;
        });
        if (mdRows.length > 1) {
          const colCount = rows[0].table_row.cells.length;
          const separator = `| ${Array(colCount).fill('---').join(' | ')} |`;
          mdRows.splice(1, 0, separator);
        }
        return mdRows.join('\n');
      }
      return '';
    }

    case 'column_list': {
      if (children?.length) {
        return blocksToMarkdown(children, indent, context);
      }
      return '';
    }

    case 'column': {
      if (children?.length) {
        return blocksToMarkdown(children, indent, context);
      }
      return '';
    }

    case 'synced_block': {
      if (children?.length) {
        return blocksToMarkdown(children, indent, context);
      }
      return '';
    }

    default:
      return `<!-- [SKIP] unsupported block: ${block.type} -->`;
  }
}

// ─── Property Extraction ─────────────────────────────────

function getPropertyValue(page, name, type) {
  const prop = page.properties[name];
  if (!prop) return undefined;

  const actualType = type || prop.type;

  switch (actualType) {
    case 'title':
      return prop.title?.map(t => t.plain_text).join('') || '';
    case 'rich_text':
      return prop.rich_text?.map(t => t.plain_text).join('') || '';
    case 'date':
      return formatNotionDate(prop.date?.start);
    case 'multi_select':
      return prop.multi_select?.map(s => s.name) || [];
    case 'select':
      return prop.select?.name || '';
    case 'status':
      return prop.status?.name || '';
    case 'checkbox':
      return prop.checkbox || false;
    case 'number':
      return prop.number ?? undefined;
    default:
      return undefined;
  }
}

function formatNotionDate(start) {
  if (!start) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(start)) {
    return `${start} 00:00:00`;
  }

  const date = new Date(start);
  if (Number.isNaN(date.getTime())) return start;

  const pad = value => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + ' ' + [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join(':');
}

// ─── Slug Validation ─────────────────────────────────────

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function suggestSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function validateSlug(slug, title) {
  if (!slug) {
    return { valid: false, reason: 'no slug', suggestion: suggestSlug(title) };
  }
  if (!SLUG_REGEX.test(slug)) {
    return { valid: false, reason: 'invalid slug', suggestion: suggestSlug(title) };
  }
  return { valid: true };
}

// ─── Page → Front Matter ─────────────────────────────────

function pageToFrontMatter(page, props) {
  const title = getPropertyValue(page, props.title) || 'Untitled';
  const slug = getPropertyValue(page, props.slug) || '';
  const date = getPropertyValue(page, props.date) || '';
  const tags = getPropertyValue(page, props.tags) || [];
  const categories = getPropertyValue(page, props.categories) || '';
  const description = props.description ? getPropertyValue(page, props.description) || '' : '';
  const toc = props.toc ? getPropertyValue(page, props.toc) : true;
  const sticky = props.sticky ? getPropertyValue(page, props.sticky) : undefined;
  const notionId = page.id;

  return { title, slug, date, tags, categories, description, toc, sticky, notionId };
}

function buildFrontMatter(meta) {
  const lines = ['---'];
  lines.push(`title: "${escapeYaml(meta.title)}"`);
  if (meta.date) lines.push(`date: ${meta.date}`);

  if (meta.tags.length) {
    lines.push('tags:');
    for (const tag of meta.tags) {
      lines.push(`  - ${escapeYaml(tag)}`);
    }
  }

  const categories = Array.isArray(meta.categories)
    ? meta.categories
    : meta.categories
      ? [meta.categories]
      : [];

  if (categories.length) {
    lines.push('categories:');
    for (const category of categories) {
      lines.push(`  - ${escapeYaml(category)}`);
    }
  }

  if (meta.description) {
    lines.push(`description: "${escapeYaml(meta.description)}"`);
  }

  if (meta.toc !== undefined && meta.toc !== true) {
    lines.push(`toc: ${meta.toc}`);
  } else if (meta.toc === true) {
    lines.push('toc: true');
  }

  if (meta.sticky !== undefined && meta.sticky !== null) {
    lines.push(`sticky: ${meta.sticky}`);
  }

  lines.push(`notion_id: ${meta.notionId}`);
  lines.push('---');

  return lines.join('\n');
}

function escapeYaml(str) {
  return String(str).replace(/"/g, '\\"');
}

// ─── Skip Logic ──────────────────────────────────────────

function shouldSkip(slug, postsDir) {
  const filePath = path.join(postsDir, `${slug}.md`);
  return fs.existsSync(filePath);
}

// ─── Image Warning Tracking ──────────────────────────────

const imageWarnings = {};

function trackImageWarning(slug) {
  imageWarnings[slug] = (imageWarnings[slug] || 0) + 1;
}

// ─── Write ───────────────────────────────────────────────

function writeIfNotExists(slug, content, postsDir) {
  const filePath = path.join(postsDir, `${slug}.md`);
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (err) {
    console.error(`  [ERROR] Failed to write ${filePath}: ${err.message}`);
    return false;
  }
}

// ─── Report ──────────────────────────────────────────────

function printReport(stats) {
  console.log('\n────────────────────────────────');
  console.log('  Sync Report');
  console.log('────────────────────────────────');
  console.log(`  Created:  ${stats.created}`);
  console.log(`  Skipped:  ${stats.skipped} (already exists)`);
  console.log(`  Invalid:  ${stats.invalid} (bad or missing slug)`);
  console.log(`  Errors:   ${stats.errors}`);

  const warnSlugs = Object.keys(imageWarnings);
  if (warnSlugs.length > 0) {
    console.log('\n  Image Warnings:');
    for (const slug of warnSlugs) {
      console.log(`    [WARN] ${slug}: contains ${imageWarnings[slug]} Notion image(s), links may expire`);
    }
  }

  console.log('────────────────────────────────\n');
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  const config = loadConfig();
  if (!config) return;
  const client = initClient(config);

  console.log('[sync] Checking Notion target...');
  let dataSource;
  let props;
  try {
    dataSource = await resolveDataSource(client, config);
    props = resolveSchemaProperties(dataSource.properties || {});
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    process.exit(1);
  }

  console.log('[sync] Querying Notion...');
  let pages;
  try {
    pages = await queryDataSourceWithPagination(client, config, dataSource, props);
  } catch (err) {
    console.error(`[ERROR] Failed to query Notion: ${err.message}`);
    process.exit(1);
  }

  console.log(`[sync] Found ${pages.length} published page(s) with Sync=true`);

  const stats = { created: 0, skipped: 0, invalid: 0, errors: 0 };

  for (const page of pages) {
    let meta;
    try {
      meta = pageToFrontMatter(page, props);
    } catch (err) {
      console.error(`  [ERROR] Failed to read page properties: ${err.message}`);
      stats.errors++;
      continue;
    }

    // Validate slug
    const validation = validateSlug(meta.slug, meta.title);
    if (!validation.valid) {
      const reason = validation.reason === 'no slug' ? 'no slug' : `invalid slug: "${meta.slug}"`;
      console.log(`  [SKIP] "${meta.title}" — ${reason}`);
      if (validation.suggestion) {
        console.log(`         suggestion: ${validation.suggestion}`);
      }
      stats.invalid++;
      continue;
    }

    const slug = meta.slug;

    // Check existing
    if (shouldSkip(slug, config.postsDir)) {
      console.log(`  [SKIP] ${slug} — file already exists`);
      stats.skipped++;
      continue;
    }

    // Fetch blocks
    let blocks;
    try {
      blocks = await fetchBlocksRecursively(client, page.id);
    } catch (err) {
      console.error(`  [ERROR] Failed to fetch blocks for ${slug}: ${err.message}`);
      stats.errors++;
      continue;
    }

    // Convert to Markdown
    const frontMatter = buildFrontMatter(meta);
    const body = blocksToMarkdown(blocks, 0, { slug });
    const content = frontMatter + '\n\n' + body + '\n';

    // Write
    const ok = writeIfNotExists(slug, content, config.postsDir);
    if (ok) {
      console.log(`  [OK] ${slug} — created`);
      stats.created++;
    } else {
      stats.errors++;
    }
  }

  printReport(stats);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`[FATAL] ${err.message}`);
    process.exit(1);
  });
}
