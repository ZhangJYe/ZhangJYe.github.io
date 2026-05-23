# Fire's Notes

个人笔记网站，基于 Hexo + Butterfly 主题搭建。

## 本地启动

```bash
npm run dev
```

访问 http://localhost:4000 预览。

## 构建

```bash
npm run build
```

生成的静态文件在 `public/` 目录。

## 清理

```bash
npm run clean
```

清除生成的缓存和静态文件。

## 新增文章

```bash
npm run new "文章标题"
```

或手动在 `source/_posts/` 下创建 `.md` 文件，格式如下：

```markdown
---
title: 文章标题
date: 2026-05-23 10:00:00
tags:
  - 标签1
  - 标签2
categories:
  - 分类名
---

正文内容...
```

## 写 Markdown 笔记

- 文章放在 `source/_posts/`
- 草稿放在 `source/_drafts/`
- 图片放在 `source/images/`
- Front Matter 必须包含 `title`、`date`、`tags`、`categories`

### 常用 Markdown 语法

```markdown
# 一级标题
## 二级标题

**加粗** *斜体* ~~删除线~~

- 无序列表
1. 有序列表

> 引用

`行内代码`

​```language
代码块
​```

[链接文字](URL)
![图片描述](图片路径)
```

## 目录结构

```
.
├── _config.yml          # Hexo 主配置
├── _config.butterfly.yml # Butterfly 主题配置
├── package.json
├── source/
│   ├── _posts/          # 文章
│   ├── _drafts/         # 草稿
│   ├── images/          # 图片
│   ├── categories/      # 分类页
│   ├── tags/            # 标签页
│   ├── archives/        # 归档页
│   └── about/           # 关于页
├── scripts/
│   └── notion/          # Notion 同步脚本
├── docs/                # 项目文档
└── public/              # 生成的静态文件（构建后）
```

## Notion 同步

参见 [docs/notion-sync.md](docs/notion-sync.md)
