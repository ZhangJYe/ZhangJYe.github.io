/**
 * Notion to Hexo Sync Script (Skeleton)
 *
 * This script syncs content from a Notion database to Hexo posts.
 * It does NOT call the real Notion API — it's a scaffold for future implementation.
 *
 * Usage:
 *   node scripts/notion/sync-notion.js
 *
 * Prerequisites:
 *   1. Copy .env.example to .env
 *   2. Fill in NOTION_TOKEN, NOTION_DATABASE_ID, NOTION_PAGE_ID
 *   3. npm install @notionhq/client dotenv
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env
// Uncomment when .env is configured:
// require('dotenv').config();

const POSTS_DIR = path.join(__dirname, '../../source/_posts');

/**
 * Initialize Notion client
 * @returns {Object} Notion client instance
 */
function initNotionClient() {
  // TODO: Initialize @notionhq/client with NOTION_TOKEN
  // const { Client } = require('@notionhq/client');
  // return new Client({ auth: process.env.NOTION_TOKEN });
  console.log('[sync] Notion client not initialized — placeholder only');
  return null;
}

/**
 * Fetch pages from Notion database
 * @param {Object} client - Notion client
 * @returns {Promise<Array>} Array of Notion pages
 */
async function fetchNotionPages(client) {
  // TODO: Query NOTION_DATABASE_ID for all pages
  // const response = await client.databases.query({
  //   database_id: process.env.NOTION_DATABASE_ID,
  // });
  // return response.results;
  console.log('[sync] fetchNotionPages — placeholder, returning empty array');
  return [];
}

/**
 * Convert a Notion page to Hexo Markdown format
 * @param {Object} page - Notion page object
 * @returns {Object} { filename, content } for Hexo post
 */
function convertToHexoMarkdown(page) {
  // TODO: Extract title, date, tags, categories from page properties
  // TODO: Convert Notion blocks to Markdown
  //
  // Example return:
  // {
  //   filename: '2026-05-23-my-post.md',
  //   content: `---\ntitle: My Post\ndate: 2026-05-23\ntags:\n  - tag1\ncategories:\n  - cat1\n---\n\nPost body...`
  // }
  console.log('[sync] convertToHexoMarkdown — placeholder');
  return null;
}

/**
 * Write a Hexo post file, skipping if it already exists
 * @param {Object} post - { filename, content }
 */
function writePost(post) {
  if (!post) return;

  const filePath = path.join(POSTS_DIR, post.filename);

  if (fs.existsSync(filePath)) {
    console.log(`[sync] Skipping existing post: ${post.filename}`);
    return;
  }

  fs.writeFileSync(filePath, post.content, 'utf-8');
  console.log(`[sync] Created post: ${post.filename}`);
}

/**
 * Main sync function
 */
async function main() {
  console.log('[sync] Starting Notion to Hexo sync...');

  const client = initNotionClient();
  const pages = await fetchNotionPages(client);

  console.log(`[sync] Found ${pages.length} pages to process`);

  for (const page of pages) {
    const post = convertToHexoMarkdown(page);
    writePost(post);
  }

  console.log('[sync] Sync complete');
}

main().catch((err) => {
  console.error('[sync] Error:', err.message);
  process.exit(1);
});
