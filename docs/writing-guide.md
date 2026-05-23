# 写作指南

## 新建文章

### 命令行方式

```bash
npm run new "文章标题"
```

会在 `source/_posts/` 下生成以标题命名的 `.md` 文件，Front Matter 自动填充。

### 手动方式

在 `source/_posts/` 下创建 `.md` 文件，格式如下：

```markdown
---
title: 文章标题
date: 2026-05-23 10:00:00
tags:
  - 标签1
  - 标签2
categories:
  - 分类名
description: 一句话描述文章内容
toc: true
---

正文内容...
```

### 草稿

未准备好发布的文章放在 `source/_drafts/`，不会被构建输出。

```bash
npm run new "草稿标题" --draft
```

预览草稿：

```bash
npx hexo server --draft
```

## Front Matter 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布日期，格式 `YYYY-MM-DD HH:mm:ss` |
| `tags` | 是 | 标签列表，至少一个 |
| `categories` | 是 | 分类，单个值即可 |
| `description` | 建议 | 一句话摘要，用于 SEO 和列表展示 |
| `toc` | 建议 | 是否生成目录，长文章建议开启 |

## 插入图片

### 方式一：直接引用（推荐）

将图片放到 `source/images/` 下，文章中引用：

```markdown
![描述](/images/my-image.png)
```

### 方式二：文章资源目录

如需每篇文章独立管理图片，可开启 `post_asset_folder`（当前未开启）。

### 图片规范

- 文件名使用小写英文和连字符：`my-image.png`
- 不使用中文文件名或空格
- 推荐格式：PNG（截图）、JPG（照片）、SVG（图标）
- 单张图片建议不超过 500KB

## 分类和标签

- 每篇文章归属**一个分类**
- 每篇文章可以有**多个标签**
- 分类和标签的命名规范见 [category-and-tag.md](./category-and-tag.md)

## 发布流程

### 本地预览

```bash
npm run dev
# 访问 http://localhost:4000
```

### 构建

```bash
npm run build
```

### 部署

本站使用 GitHub Actions 自动部署。将文章提交并推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。

```bash
git add source/_posts/你的文章.md
git commit -m "post: 文章标题"
git push origin main
```

### 注意事项

- 推送前先本地预览确认格式正确
- Front Matter 中的 `date` 决定文章排序，不要遗漏
- `description` 会显示在文章列表中，建议控制在一句话以内
