# Fire's Notes

个人笔记网站，基于 Hexo + Butterfly 主题搭建。

站点地址：https://ZhangJYe.github.io

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

## 写作与发布

### 新建文章

```bash
npm run new "文章标题"
```

文章会生成在 `source/_posts/`，自动填充 Front Matter 模板（title、date、tags、categories、description、toc）。

### 写作规范

- 文章放在 `source/_posts/`
- 草稿放在 `source/_drafts/`
- 图片放在 `source/images/`
- Front Matter 必须包含 `title`、`date`、`tags`、`categories`
- 详细指南见 [docs/writing-guide.md](docs/writing-guide.md)

### 分类与标签

- 分类：`AI Engineering`、`AIOps`、`Agent`、`Golang`、`Backend`、`Research`、`Interview`、`English`、`Life`
- 标签围绕具体技术点，如 `SDD`、`Go`、`RAG`、`MCP`、`Kubernetes` 等
- 完整规范见 [docs/category-and-tag.md](docs/category-and-tag.md)

### 发布到 GitHub Pages

```bash
git add source/_posts/你的文章.md
git commit -m "post: 文章标题"
git push origin main
```

推送后 GitHub Actions 自动构建并部署到 https://ZhangJYe.github.io。

## 目录结构

```
.
├── _config.yml              # Hexo 主配置
├── _config.butterfly.yml    # Butterfly 主题配置
├── scaffolds/post.md        # 文章模板
├── package.json
├── source/
│   ├── _posts/              # 文章
│   ├── _drafts/             # 草稿
│   ├── images/              # 图片资源
│   ├── categories/          # 分类页
│   ├── tags/                # 标签页
│   ├── archives/            # 归档页
│   └── about/               # 关于页
├── scripts/
│   └── notion/              # Notion 同步脚本
├── docs/                    # 项目文档
│   ├── writing-guide.md     # 写作指南
│   ├── category-and-tag.md  # 分类标签规范
│   └── notion-sync.md       # Notion 同步说明
└── public/                  # 生成的静态文件（构建后）
```

## 文档

- [写作指南](docs/writing-guide.md) — 如何新建文章、设置分类标签、插入图片、发布
- [分类与标签规范](docs/category-and-tag.md) — 分类体系和标签命名规范
- [Notion 同步](docs/notion-sync.md) — 后续从 Notion 同步内容的说明
