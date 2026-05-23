cat > CLAUDE.md <<'EOF'
# Claude Code 项目开发规则

## 项目目标

这是一个个人笔记网站项目，使用 Hexo + Butterfly 搭建。

目标：

1. 支持本地 Markdown 写作。
2. 使用 Butterfly 主题。
3. 后续支持从 Notion 同步内容到网站。
4. 不自动部署。
5. 不自动推送 GitHub。
6. 不写入任何真实密钥。

## 技术栈

- Hexo
- Butterfly
- Markdown
- Node.js
- npm
- 后续 Notion 同步脚本使用 Node.js

## 开发规则

1. 修改代码前，先阅读项目已有文件。
2. 大改动前，先给出简短实现计划。
3. 不要删除用户已有文件。
4. 不要修改系统级配置。
5. 不要自动部署。
6. 不要自动 git push。
7. 不要把 Notion Token、API Key、密码写进代码。
8. 所有密钥使用 .env 或环境变量。
9. 遇到不确定情况，先说明，不要乱猜。
10. 构建失败不能假装成功。
11. 如果需要安装项目依赖，可以在当前项目目录内执行 npm install。
12. 不要修改全局 Node/npm 配置。

## Hexo 规范

1. 文章放在 source/_posts/。
2. 草稿放在 source/_drafts/。
3. 图片放在 source/images/。
4. 文章必须有 Front Matter。
5. Front Matter 至少包含 title、date、tags、categories。

## 本次任务

请帮我一次性完成 Hexo + Butterfly 个人笔记网站初始化。

要求：

1. 检查 Node 和 npm 环境。
2. 如果当前目录还不是 Hexo 项目，则初始化 Hexo 项目。
3. 安装并配置 Butterfly 主题。
4. 配置网站基本信息：
   - title: Fire's Notes
   - subtitle: SDD, Agent, AIOps, Backend
   - author: Fire
   - language: zh-CN
   - timezone: Asia/Shanghai
5. 配置基础 permalink。
6. 创建分类、标签、归档、关于页面。
7. 创建文章目录 source/_posts/。
8. 创建草稿目录 source/_drafts/。
9. 创建图片目录 source/images/。
10. 创建一篇示例文章：
    - 文件名：source/_posts/2026-05-23-sdd-agent-notes.md
    - 主题：SDD、Prompt、Rules、AGENTS.md、Agent Skill 的关系。
11. 创建 README.md，说明：
    - 如何本地启动
    - 如何构建
    - 如何清理
    - 如何新增文章
    - 如何写 Markdown 笔记
12. 创建 .env.example，预留 Notion 配置：
    - NOTION_TOKEN=
    - NOTION_DATABASE_ID=
    - NOTION_PAGE_ID=
13. 创建 scripts/notion/sync-notion.js，作为 Notion 同步脚本骨架。
14. 创建 docs/notion-sync.md，说明后续如何从 Notion 同步到 Hexo。
15. 在 package.json 中提供以下命令：
    - npm run dev
    - npm run build
    - npm run clean
    - npm run new
16. 最后运行 npm run build 验证。

## Notion 同步骨架要求

1. 不要写真实 Token。
2. 不要调用真实 Notion API。
3. 只写脚本骨架和文档。
4. 脚本需要预留读取 .env 的位置。
5. 脚本需要预留将 Notion 内容转换为 Hexo Markdown 的函数。
6. 不要覆盖已有文章。

## 输出要求

完成后请输出：

1. 修改了哪些文件。
2. 如何本地运行。
3. 如何新增文章。
4. 构建是否成功。
5. 后续 Notion 同步还需要补什么。
6. 如果有失败，明确说明失败原因，不要假装成功。

## 禁止事项

1. 不要自动部署。
2. 不要 git push。
3. 不要写入真实密钥。
4. 不要删除用户已有内容。
5. 不要修改全局 Node/npm 配置。
6. 不要执行危险删除命令。

## Git 工作流

1. 每次任务完成并通过 `npm run build` 后，可以自动创建本地 Git commit。
2. 自动 commit 前必须先执行 `git status`，确认不会提交：
   - node_modules/
   - public/
   - .env
   - db.json
   - 任何真实密钥或隐私文件
3. commit message 必须使用规范格式：
   - feat: 新功能
   - fix: 修复问题
   - docs: 文档或文章
   - style: 样式或主题调整
   - chore: 配置或工程杂项
   - refactor: 重构
4. 每次 commit 前必须输出本次将提交的文件列表。
5. 允许自动执行：
   - git status
   - git add .
   - git commit -m "..."
6. 禁止自动执行：
   - git push
   - git push --force
   - git reset --hard
   - git clean -fd
7. 是否 push 必须由用户手动决定。