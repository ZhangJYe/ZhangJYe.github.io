# Hexo + Butterfly 网站初始化提示词

## 使用场景

从零搭建一个基于 Hexo + Butterfly 主题的个人笔记网站。

## 提示词

```
请帮我一次性完成 Hexo + Butterfly 个人笔记网站初始化。

要求：

1. 检查 Node 和 npm 环境。
2. 如果当前目录还不是 Hexo 项目，则初始化 Hexo 项目。
3. 安装并配置 Butterfly 主题。
4. 配置网站基本信息：
   - title: <你的站点标题>
   - subtitle: <你的副标题>
   - author: <你的名字>
   - language: zh-CN
   - timezone: Asia/Shanghai
5. 配置基础 permalink。
6. 创建分类、标签、归档、关于页面。
7. 创建文章目录 source/_posts/。
8. 创建草稿目录 source/_drafts/。
9. 创建图片目录 source/images/。
10. 创建一篇示例文章。
11. 创建 README.md，说明如何本地启动、构建、清理、新增文章。
12. 创建 .env.example，预留后续集成配置。
13. 在 package.json 中提供以下命令：
    - npm run dev
    - npm run build
    - npm run clean
    - npm run new
14. 最后运行 npm run build 验证。

禁止事项：
- 不要自动部署。
- 不要 git push。
- 不要写入真实密钥。
- 不要删除用户已有内容。
- 不要修改全局 Node/npm 配置。
```

## 注意事项

- `hexo init` 要求空目录，如果目录非空需要先在临时目录初始化再合并。
- Butterfly 主题推荐使用 npm 安装（`npm install hexo-theme-butterfly`），通过 `_config.butterfly.yml` 覆盖主题配置。
- `.gitignore` 需包含 `.env`、`node_modules/`、`public/`、`db.json`、`.DS_Store`。
