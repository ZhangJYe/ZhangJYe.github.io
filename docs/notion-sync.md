# Notion 同步到 Hexo 说明

## 概述

从 Notion Database 单向同步已发布文章到 Hexo Markdown。

安全原则：
- 只同步 Status=已发布 且 Sync=true 的页面
- 不覆盖已有文件
- 不删除本地文章
- 不做双向同步

## 快速开始

### 1. 配置 .env

```bash
cp .env.example .env
```

编辑 `.env`，填入你的 Notion Integration Token：

```
NOTION_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxxxxx
```

Data Source ID 和 Database ID 已预填，如果需要同步其他 Database，修改对应值。

### 2. 安装依赖

```bash
npm install @notionhq/client dotenv
```

### 3. 运行同步

```bash
npm run sync:notion
```

## Notion Database 字段要求

| 字段名 | 类型 | 必填 | 映射到 |
|--------|------|------|--------|
| 文章标题 | Title | 是 | `title` |
| 文件名 | Rich Text | 是 | 文件名 `{slug}.md` |
| 发布日期 | Date | 是 | `date` |
| 标签 | Multi-select | 是 | `tags` |
| 分类 | Select | 是 | `categories` |
| 摘要 | Rich Text | 建议 | `description` |
| 状态 | Select | 是 | 过滤条件（已发布） |
| 是否同步 | Checkbox | 是 | 过滤条件（true） |
| Toc | Checkbox | 否 | `toc`，默认 true |
| Sticky | Number | 否 | `sticky`，置顶权重 |

脚本自动写入 `notion_id` 字段到 Front Matter，用于后续增量同步定位来源。

## 同步规则

### 过滤条件

只同步满足以下条件的页面：
- 状态 = 已发布
- 是否同步 = true

### 文件命名

- 输出路径：`source/_posts/{文件名}.md`
- 文件名只能包含小写英文、数字、连字符
- 文件名为空或非法 → 跳过并打印建议
- 文件已存在 → 跳过，不覆盖

### Rich Text 支持

第一版支持：
- **bold** → `**text**`
- *italic* → `*text*`
- `code` → `` `text` ``
- ~~strikethrough~~ → `~~text~~`
- [link](url) → `[text](url)`

### Block 支持

第一版支持 15 种 Block 类型：

| Block 类型 | Markdown 输出 |
|------------|---------------|
| paragraph | 段落文本 |
| heading_1/2/3 | `#` / `##` / `###` |
| bulleted_list_item | `- text` |
| numbered_list_item | `1. text` |
| to_do | `- [ ] text` / `- [x] text` |
| toggle | `<details>` 展开 |
| code | ` ```lang ... ``` ` |
| quote | `> text` |
| divider | `---` |
| bookmark | `[url](url)` |
| image | `![alt](notion-url)` |
| callout | `> 💡 text` |
| table | Markdown 表格 |
| column_list | 递归展开 |
| column | 递归展开 |
| synced_block | 递归展开 |

不支持的 block 输出：`<!-- [SKIP] unsupported block: {type} -->`

### 图片处理

第一版不下载图片，保留 Notion URL。同步报告会输出图片过期警告。

后续版本将下载到 `source/images/notion/{slug}/`。

## 输出示例

```
[sync] Querying Notion...
[sync] Found 3 published page(s) with Sync=true
  [OK] sdd-agent-notes — created
  [SKIP] hello-world — file already exists
  [SKIP] "Draft Article" — no slug
         suggestion: draft-article
────────────────────────────────
  Sync Report
────────────────────────────────
  Created:  1
  Skipped:  1 (already exists)
  Invalid:  1 (bad or missing slug)
  Errors:   0
────────────────────────────────
```

## 后续扩展

- `--force` 覆盖已有文件
- `--dry-run` 只预览不写入
- 增量同步（基于 `.sync-state.json`）
- 图片自动下载
- 自动 git commit
