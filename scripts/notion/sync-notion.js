/**
 * Notion → Hexo Markdown 单向同步脚本
 *
 * 安全原则：
 * - 只同步 Status=已发布 且 Sync=true 的页面
 * - 不覆盖已有文件
 * - 不删除本地文章
 * - 不做双向同步
 */

const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────

function loadConfig() {
  require('dotenv').config();

  const token = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;

  if (!token) {
    console.error('[ERROR] NOTION_TOKEN is required in .env');
    process.exit(1);
  }

  if (!dataSourceId) {
    console.error('[ERROR] NOTION_DATA_SOURCE_ID is required in .env');
    process.exit(1);
  }

  return {
    token,
    dataSourceId,
    postsDir: path.join(__dirname, '../../source/_posts'),
  };
}

// ─── Notion Client ───────────────────────────────────────

let Client;
try {
  Client = require('@notionhq/client').Client;
} catch {
  console.error('[ERROR] @notionhq/client not installed. Run: npm install @notionhq/client');
  process.exit(1);
}

function initClient(config) {
  return new Client({ auth: config.token });
}

// ─── Query with Pagination ───────────────────────────────

async function queryDataSourceWithPagination(client, config) {
  const filter = {
    and: [
      { property: '状态', select: { equals: '已发布' } },
      { property: '是否同步', checkbox: { equals: true } },
    ],
  };

  const allResults = [];
  let cursor = undefined;

  while (true) {
    const response = await client.dataSources.query({
      data_source_id: config.dataSourceId,
      filter,
      start_cursor: cursor,
    });

    allResults.push(...response.results);

    if (!response.has_more) break;
    cursor = response.next_cursor;
  }

  return allResults;
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

function blocksToMarkdown(blocks, indent = 0) {
  const lines = [];
  const prefix = '  '.repeat(indent);
  let orderedIndex = 0;

  for (const block of blocks) {
    try {
      const md = blockToMarkdown(block, indent);
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

function blockToMarkdown(block, indent) {
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
        return text + '\n' + blocksToMarkdown(children, indent + 1);
      }
      return text;
    }

    case 'numbered_list_item': {
      const text = richTextToMarkdown(data.rich_text);
      if (children?.length) {
        return text + '\n' + blocksToMarkdown(children, indent + 1);
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
        return text + '\n\n' + blocksToMarkdown(children, indent + 1) + '\n</details>';
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
        const childLines = blocksToMarkdown(children, 0).split('\n');
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
      return `![${caption}](${url})`;
    }

    case 'callout': {
      const icon = data.icon?.emoji || '💡';
      const text = `> ${icon} ${richTextToMarkdown(data.rich_text)}`;
      if (children?.length) {
        const childLines = blocksToMarkdown(children, 0).split('\n');
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
        return blocksToMarkdown(children, indent);
      }
      return '';
    }

    case 'column': {
      if (children?.length) {
        return blocksToMarkdown(children, indent);
      }
      return '';
    }

    case 'synced_block': {
      if (children?.length) {
        return blocksToMarkdown(children, indent);
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

  switch (type) {
    case 'title':
      return prop.title?.map(t => t.plain_text).join('') || '';
    case 'rich_text':
      return prop.rich_text?.map(t => t.plain_text).join('') || '';
    case 'date':
      return prop.date?.start || '';
    case 'multi_select':
      return prop.multi_select?.map(s => s.name) || [];
    case 'select':
      return prop.select?.name || '';
    case 'checkbox':
      return prop.checkbox || false;
    case 'number':
      return prop.number ?? undefined;
    default:
      return undefined;
  }
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

function pageToFrontMatter(page) {
  const title = getPropertyValue(page, '文章标题', 'title') || 'Untitled';
  const slug = getPropertyValue(page, '文件名', 'rich_text') || '';
  const date = getPropertyValue(page, '发布日期', 'date') || '';
  const tags = getPropertyValue(page, '标签', 'multi_select') || [];
  const categories = getPropertyValue(page, '分类', 'select') || '';
  const description = getPropertyValue(page, '摘要', 'rich_text') || '';
  const toc = getPropertyValue(page, 'Toc', 'checkbox');
  const sticky = getPropertyValue(page, 'Sticky', 'number');
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

  if (meta.categories) {
    lines.push('categories:');
    lines.push(`  - ${escapeYaml(meta.categories)}`);
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

  console.log('[sync] Querying Notion...');
  let pages;
  try {
    pages = await queryDataSourceWithPagination(client, config);
  } catch (err) {
    console.error(`[ERROR] Failed to query Notion: ${err.message}`);
    process.exit(1);
  }

  console.log(`[sync] Found ${pages.length} published page(s) with Sync=true`);

  const stats = { created: 0, skipped: 0, invalid: 0, errors: 0 };

  for (const page of pages) {
    let meta;
    try {
      meta = pageToFrontMatter(page);
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
    const body = blocksToMarkdown(blocks);
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
