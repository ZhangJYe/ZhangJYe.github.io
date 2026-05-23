# Hexo Butterfly 前端视觉优化 — Claude Code 执行 Prompt

## 前置准备

1. 读取 `CLAUDE.md` 了解项目规范。
2. 读取 `.claude/skills/frontend-design.md`，这是本次优化的设计指南，包含配色方案、字体组合、CSS 变量、Butterfly 类名速查表。**所有视觉决策必须参考此文件。**
3. 读取 `_config.yml` 和 `_config.butterfly.yml` 了解当前配置。
4. 读取 `source/_posts/` 下现有文章列表，了解内容规模。
5. 运行 `hexo clean && hexo g && hexo s`，确认当前站点可以正常构建和预览。

---

## 设计方向

**风格定位**：干净、克制、技术感。学术感和工程感结合。

**参考方向**：Editorial + Refined Minimal（参考 Notion 的温暖排版 + Vercel 的精致间距）

**绝对禁止**：
- 紫色渐变背景
- 过度动画
- 外链随机图片
- 文章封面图（不启用）
- 装饰性 SVG 插图
- 毛玻璃滥用
- Inter 字体（过度使用）

**核心原则**：
- 内容优先，排版即装饰
- 一个主色调 + 精确强调色
- 字体即层级，不靠堆图标
- 暗色模式必须适配

---

## 执行任务

### 第一阶段：配置优化（_config.butterfly.yml）

**1. 导航栏**

配置完整导航：
- 首页 /
- 归档 /archives
- 分类 /categories
- 标签 /tags
- 关于 /about

简洁，不堆项目，中英文风格统一。

**2. 首页 subtitle / 打字机文案**

围绕以下关键词配置：
- SDD
- Agent Engineering
- AIOps
- Go Backend
- Research Notes
- AI Coding

目标：让访问者一眼知道这是技术学习、科研记录和工程实践笔记站。

**3. 侧边栏精简**

- 保留：个人信息卡片、最近文章、分类、标签
- 移除或弱化：Follow Me 按钮（改为简洁 GitHub 链接）
- 公告内容改为自然文案，不要模板感
- 头像继续使用本地 SVG（`source/images/avatar.svg`），不要外链
- 侧边栏模块不要超过 4 个

**4. 关闭不需要的功能**

- 文章封面图：关闭 default_cover 所有选项（`default_cover: false` 或留空）
- 文章页不要自动封面

**5. 代码块**

- 保留代码高亮
- 保留复制按钮
- 行号可选

---

### 第二阶段：自定义 CSS 注入

**方式**：通过 `_config.butterfly.yml` 的 `inject.custom_css` 注入 `source/css/custom.css`。

**不要直接改 `themes/butterfly/` 下的源文件。**

`source/css/custom.css` 中必须包含：

**1. CSS 变量（参考 `.claude/skills/frontend-design.md` 第 5 节调色板）**

使用「温暖学术」方案或「精致暗色」方案，二选一并全程贯彻。

必须同时适配亮色和暗色：
```css
:root { /* 亮色变量 */ }
[data-theme="dark"] { /* 暗色变量 */ }
```

**2. 字体（参考 skill 第 4 节）**

选择一组字体组合并贯穿全站。通过 Google Fonts CDN 引入，写在 `inject.head` 中。

不超过 3 个字体族。

**3. 文章正文排版（参考 skill 第 6 节）**

- 最大宽度 720px，居中
- 行高 1.6-1.8
- 段落间距 1.5em
- 标题层级用字号 + 下划线或左边框区分

**4. 文章卡片优化**

- 标题字号稍大，加粗
- 摘要限制 3-4 行，超出省略
- 元信息（日期、分类、标签）用小字、次要颜色
- 卡片之间间距适当，不要太紧凑

**5. 代码块样式（参考 skill 第 7.1 节）**

深色背景、等宽字体、圆角、边框。

**6. 标签云样式（参考 skill 第 7.4 节）**

小标签形式，hover 变色，不堆砌。

**7. 链接样式（参考 skill 第 7.3 节）**

下划线动画，hover 变色。

**8. 页面加载动效（参考 skill 第 8 节）**

仅 fadeInUp 渐入，不超过 0.5s，尊重 prefers-reduced-motion。

---

### 第三阶段：About 页面重写

重写 `source/about/index.md`，使其像真实个人主页。

内容框架：
1. 我是谁：武汉大学研究生，国家网络安全学院
2. 研究方向：AIOps + Agent
3. 技术关注：Go 后端、智能运维、AI Coding、RAG、工程化 Agent
4. 为什么写这个站：沉淀学习笔记、科研记录、项目复盘
5. 内容分类：AIOps、Agent、后端工程、论文阅读、面试复盘

语气：自然、真实、不商业化、不过度包装。

---

### 第四阶段：验证

1. 运行 `hexo clean && hexo g`，确认构建成功。
2. 检查是否有控制台错误。
3. 确认亮色模式正常。
4. 确认暗色模式正常。
5. 确认移动端布局正常（响应式未被破坏）。
6. 确认文章封面图功能未被启用。
7. 确认没有外链图片。

---

## 输出要求

完成后输出：

1. 读取了哪些文件。
2. 修改了哪些文件（列出完整路径）。
3. 做了哪些视觉优化（逐条列出）。
4. 配色方案选择（亮色/暗色/双主题）。
5. 字体选择。
6. `npm run build` 是否通过。
7. 如果构建失败，给出错误原因和修复方案。
8. `git commit` 是否完成（不要 git push）。
9. commit message：`style: refine homepage and reading experience`
10. 下一步预览方式：`npm run dev`

---

## 约束重申

- 不要直接修改 `themes/butterfly/` 源码
- 不要引入新的 npm 依赖
- 不要自动部署或 git push
- 不要写入任何密钥
- 不要删除已有文章
- 不要启用文章封面图
- 不要使用外链随机图片
- 不要过度动画
- 构建失败不能假装成功
