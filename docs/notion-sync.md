# Notion 同步到 Hexo 说明

## 概述

从 Notion Database 单向同步已发布文章到 Hexo Markdown。

安全原则：
- 只同步 Status=Published（或 已发布）且 Sync=true 的页面
- 不覆盖已有文件
- 不删除本地文章
- 不做双向同步

## 快速开始

### 1. 配置 .env

```bash
cp .env.example .env
```

编辑 `.env`，填入你的 Notion Integration Token 和目标 ID：

```
NOTION_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATA_SOURCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

推荐填写 `NOTION_DATA_SOURCE_ID`。如果只拿到了 Database ID，也可以填写 `NOTION_DATABASE_ID`，脚本会尝试读取该 Database 下的第一个 Data Source。

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
| Title | Title | 是 | `title` |
| Slug | Rich Text | 是 | 文件名 `{slug}.md` |
| Date | Date | 是 | `date` |
| Tags | Multi-select | 是 | `tags` |
| Categories | Select | 是 | `categories` |
| Description | Rich Text | 建议 | `description` |
| Status | Select 或 Status | 是 | 过滤条件（Published） |
| Sync | Checkbox | 是 | 过滤条件（true） |
| Toc | Checkbox | 否 | `toc`，默认 true |
| Sticky | Number | 否 | `sticky`，置顶权重 |

兼容旧中文字段名：`文章标题`、`文件名`、`发布日期`、`标签`、`分类`、`摘要`、`状态`、`是否同步`。

脚本自动写入 `notion_id` 字段到 Front Matter，用于后续增量同步定位来源。

## 同步规则

### 过滤条件

只同步满足以下条件的页面：
- Status = Published（默认同时兼容 已发布）
- Sync = true

如果你的发布状态不是 `Published`，可以在 `.env` 中配置：

```
NOTION_STATUS_VALUES=Published,已发布
```

### 文件命名

- 输出路径：`source/_posts/{Slug}.md`
- Slug 只能包含小写英文、数字、连字符
- Slug 为空或非法 → 跳过并打印建议
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

## 常见错误

### Could not find database / object_not_found

这个错误通常不是 Markdown 转换问题，而是 Notion API 无法访问你填入的 ID。

检查顺序：

1. 打开原始 Full-page Database，不要打开 linked database view。
2. 右上角 `...` → `Connections` → 添加你的 Integration。
3. 确认 `.env` 中的 `NOTION_DATA_SOURCE_ID` 是 Data Source ID；如果你只有 Database ID，填到 `NOTION_DATABASE_ID`。
4. 如果复制的是 Notion URL，保留完整 URL 也可以，脚本会自动提取 ID。
5. linked data source 需要授权原始 Database，而不是只授权当前页面。

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
