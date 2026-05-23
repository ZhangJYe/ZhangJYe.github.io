# Notion 同步到 Hexo 说明

## 概述

本项目预留了从 Notion 同步内容到 Hexo 的能力。脚本骨架在 `scripts/notion/sync-notion.js`。

## 当前状态

脚本为骨架代码，不调用真实 API。需要后续补充：

1. 安装依赖：`npm install @notionhq/client dotenv`
2. 配置 `.env` 文件
3. 实现 `fetchNotionPages()` 函数
4. 实现 `convertToHexoMarkdown()` 函数

## 配置步骤

### 1. 创建 Notion Integration

1. 访问 https://www.notion.so/my-integrations
2. 创建新的 Integration
3. 复制 Internal Integration Token

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```
NOTION_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_PAGE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 3. 授权 Integration 访问 Database

在 Notion 中，打开目标 Database，点击右上角 `...` → `Connections` → 添加你的 Integration。

### 4. 安装依赖

```bash
npm install @notionhq/client dotenv
```

### 5. 取消脚本中的注释

在 `scripts/notion/sync-notion.js` 中：

- 取消 `require('dotenv').config()` 的注释
- 实现 `initNotionClient()` 函数
- 实现 `fetchNotionPages()` 函数
- 实现 `convertToHexoMarkdown()` 函数

## 运行同步

```bash
node scripts/notion/sync-notion.js
```

## 注意事项

- 已存在的同名文章不会被覆盖
- 同步后的文章在 `source/_posts/` 中，可以手动编辑
- 建议同步前先 `npm run clean` 清理缓存
- 不要把 `.env` 文件提交到版本控制
