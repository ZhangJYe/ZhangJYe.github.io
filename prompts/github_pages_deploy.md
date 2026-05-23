# GitHub Pages + GitHub Actions 部署提示词

## 使用场景

配置 Hexo 站点通过 GitHub Actions 自动部署到 GitHub Pages。

## 提示词

```
请帮我配置 GitHub Actions 自动部署 Hexo 到 GitHub Pages。

背景：
我的 GitHub Pages 仓库地址是：https://github.com/<用户名>/<仓库名>.git
发布地址是：https://<用户名>.github.io

要求：
1. 修改 _config.yml，将 url 设置为 https://<用户名>.github.io，将 root 设置为 /。
2. 创建 .github/workflows/deploy.yml。
3. GitHub Actions 使用 Node.js 22。
4. 使用 npm ci 安装依赖。
5. 使用 npm run build 构建 Hexo。
6. 将 public/ 发布到 GitHub Pages。
7. 不要执行 git push。
8. 不要自动部署。
9. 不要写入任何密钥。
10. 最后运行 npm run build 验证。

输出：
- 修改了哪些文件
- 我接下来需要手动执行哪些 git 命令
```

## deploy.yml 模板

```yaml
name: Deploy Hexo to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm

      - run: npm ci

      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 注意事项

- 用户主页仓库（`<用户名>.github.io`）的 `root` 必须是 `/`，不是 `/<仓库名>/`。
- 推送后需在 GitHub 仓库 Settings → Pages 中将 Source 设置为 **GitHub Actions**。
- 如果仓库改名，需同步修改 `_config.yml` 中的 `url` 和 git remote 地址。
