# Notion 同步实现规划提示词

## 使用场景

将 Notion 中的内容同步到 Hexo 站点。当前项目已有骨架脚本 `scripts/notion/sync-notion.js`。

## 规划提示词

```
请帮我实现从 Notion 同步内容到 Hexo 的功能。

当前状态：
- 骨架脚本：scripts/notion/sync-notion.js（已有，需要填充实现）
- 配置模板：.env.example（已有 NOTION_TOKEN、NOTION_DATABASE_ID、NOTION_PAGE_ID）
- 文档：docs/notion-sync.md（已有说明）

要求：
1. 使用 @notionhq/client 官方 SDK。
2. 使用 dotenv 读取 .env 配置。
3. 实现以下功能：
   a. 从 Notion Database 查询所有页面
   b. 将 Notion 页面属性映射到 Hexo Front Matter（title、date、tags、categories）
   c. 将 Notion Block 内容转换为 Markdown
   d. 写入 source/_posts/ 目录
4. 已存在的同名文章不覆盖（可选加 --force 参数覆盖）。
5. 支持增量同步（只同步上次同步后有更新的页面）。
6. 不要写入真实 Token。
7. 不要调用真实 API 进行测试，用 mock 或 dry-run 模式。
8. 在 package.json 中添加 "sync" 命令。

请先给出实现计划，确认后再写代码。
```

## 实现要点

### 依赖安装

```bash
npm install @notionhq/client dotenv
```

### Notion Database 结构建议

在 Notion 中创建 Database，包含以下属性：

| 属性名 | 类型 | 用途 |
|--------|------|------|
| Title | Title | 文章标题 |
| Date | Date | 发布日期 |
| Tags | Multi-select | 标签列表 |
| Categories | Select | 分类 |
| Status | Select | Draft / Published |
| Slug | Rich Text | URL 拼接（可选） |

### Notion Block → Markdown 转换要点

- `paragraph` → 普通文本段落
- `heading_1/2/3` → `# / ## / ###`
- `bulleted_list_item` → `- `
- `numbered_list_item` → `1. `
- `code` → ` ```language ... ``` `
- `image` → `![](url)`（需处理 Notion 的临时 URL）
- `bookmark` → `[title](url)`
- `quote` → `> `
- `divider` → `---`

### 增量同步方案

1. 记录上次同步时间到 `.sync-state.json`
2. 查询时使用 `filter: { last_edited_time: { after: last_sync } }`
3. 同步完成后更新 `.sync-state.json`
4. `.sync-state.json` 加入 `.gitignore`

### package.json scripts

```json
{
  "sync": "node scripts/notion/sync-notion.js",
  "sync:dry": "node scripts/notion/sync-notion.js --dry-run"
}
```

## 注意事项

- Notion API 的图片 URL 是临时的，过期后不可访问。建议下载到 `source/images/` 并替换链接。
- Notion 的 rich_text 需要递归解析，注意处理 bold、italic、code、link 等内联样式。
- 同步脚本应在 `.gitignore` 中排除 `.sync-state.json`。
- Token 等敏感信息只放在 `.env`，绝不提交到仓库。
