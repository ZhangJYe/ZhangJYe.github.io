---
name: frontend-design
description: >
  Hexo + Butterfly 个人笔记站前端视觉优化指南。
  综合 OpenAI frontend-design、claude-design 设计流程、popular-web-designs 设计系统参考，
  生成有辨识度、非 AI 审美的高质量前端代码。
license: MIT
triggers:
  - 优化页面样式
  - 美化笔记站
  - 改 Butterfly 主题
  - 前端视觉优化
  - style the site
  - beautify the blog
  - redesign the notes site
---

# Frontend Design — Hexo Butterfly 专用优化指南

本 skill 用于对 Hexo + Butterfly 个人笔记站进行系统性前端视觉优化。

目标：生成有辨识度、生产级、非"AI 审美"的前端代码。

---

## 0. 前置约束

### 项目结构

```
notes-site/
├── _config.yml                  # Hexo 主配置
├── _config.butterfly.yml        # Butterfly 主题覆盖配置（优先级最高）
├── themes/butterfly/
│   ├── layout/                  # EJS 模板
│   │   ├── layout.ejs           # 主布局
│   │   ├── index.ejs            # 首页
│   │   ├── post.ejs             # 文章页
│   │   ├── tag.ejs              # 标签页
│   │   ├── category.ejs         # 分类页
│   │   └── includes/
│   │       ├── header/          # 头部导航
│   │       ├── sidebar/         # 侧边栏
│   │       ├── footer/          # 底部
│   │       └── post/            # 文章组件
│   └── source/
│       └── css/                 # Stylus 源文件（.styl）
│           ├── _global/         # 全局变量、颜色、字体
│           ├── _layout/         # 布局样式
│           ├── _page/           # 页面样式
│           └── _highlight/      # 代码高亮
├── source/
│   ├── _posts/                  # 文章
│   ├── _data/                   # 自定义数据（butterfly.yml 覆盖等）
│   └── css/                     # 自定义 CSS（通过 inject 注入）
└── scripts/                     # Hexo 脚本
```

### 技术栈

- CSS 预处理器：**Stylus**（Butterfly 默认）
- 模板引擎：**EJS**
- 样式注入方式：`_config.butterfly.yml` → `inject.custom_css`
- JS 注入方式：`_config.butterfly.yml` → `inject.custom_js`
- 暗色模式：Butterfly 内置，通过 `meta_generator` 和 `darkmode` 配置控制

### 关键配置文件

| 文件 | 作用 |
|------|------|
| `_config.butterfly.yml` | 主题覆盖配置，改样式优先改这里 |
| `_config.yml` | Hexo 全局配置（title、permalink 等） |
| `source/css/custom.css` | 自定义 CSS，通过 inject 注入 |
| `source/js/custom.js` | 自定义 JS，通过 inject 注入 |
| `themes/butterfly/source/css/_global/` | Stylus 变量（颜色、字体、间距） |

---

## 1. 设计思考（Design Thinking）

在写代码前，先理解上下文，确定一个**大胆的审美方向**。

### 1.1 上下文分析

- **用途**：个人笔记站，技术学习记录，面试准备
- **读者**：自己 + 潜在面试官 + 技术同行
- **调性**：技术感、专业、有深度、不浮夸
- **差异化**：不是又一个紫色渐变的 AI 博客

### 1.2 审美方向选择

选择一个明确的方向并精确执行。大胆和克制都可以——关键是**有意图**。

推荐方向（可选其一或混合）：

| 方向 | 特征 | 参考 |
|------|------|------|
| **Editorial / 杂志感** | 大标题、留白、衬线体标题、层次分明 | Notion、Medium |
| **Terminal / 终端感** | 深色背景、等宽字体、代码优先 | Ollama、Warp |
| **Refined Minimal / 精致极简** | 细线条、大量留白、字体即装饰 | Vercel、Linear |
| **Warm Academic / 学术温暖** | 暖色调、衬线体、纸质质感 | Notion、Obsidian |
| **Dark Industrial / 暗色工业** | 深色底、高对比、几何感 | Stripe、ElevenLabs |

**关键**：选一个方向，全程贯彻。不要在同一个页面里混用多种风格。

### 1.3 记忆点设计

问自己：访客离开后会记住什么？

- 一个独特的排版方式？
- 一个意外的交互细节？
- 一种一致的视觉语言？

---

## 2. 反 AI 审美规则（Anti-Slop）

### 绝对禁止

```css
/* ❌ 绝对不要出现这些 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* 紫色渐变 */
font-family: 'Inter', sans-serif;                                /* 过度使用的 Inter */
border-radius: 999px;                                            /* 无限圆角 */
backdrop-filter: blur(20px);                                     /* 滥用毛玻璃 */
box-shadow: 0 8px 32px rgba(0,0,0,0.1);                         /* 千篇一律的阴影 */
```

### 避免的模式

- 紫色渐变白色背景（AI 生成的标志）
- 所有卡片都是圆角矩形 + 图标 + 标题 + 描述
- 装饰性 SVG 插图假装是产品图
- 没有内容的假 Dashboard 数据
- 彩虹调色板
- 标签为"Insights"、"Growth"、"Scale"的空洞文案

### 鼓励的做法

- 有意识的留白（不是空，是呼吸）
- 字体即装饰（不靠图标堆砌）
- 一个主色调 + 精确的强调色
- 真实的内容，真实的层级
- 对比、重复、对齐、亲密性（设计四原则）

---

## 3. Butterfly 主题定制指南

### 3.1 注入自定义 CSS（推荐方式）

在 `_config.butterfly.yml` 中：

```yaml
inject:
  custom_css:
    - /css/custom.css
```

然后在 `source/css/custom.css` 中写自定义样式。

### 3.2 覆盖 Butterfly 变量

在 `source/css/custom.css` 中覆盖 Stylus 变量（需要编译为 CSS）：

```css
:root {
  /* 颜色系统 */
  --global-bg: #ffffff;
  --font-color: #1a1a2e;
  --card-bg: #f8f9fa;
  --sidebar-bg: #fafafa;
  
  /* 字体 */
  --global-font: 'Source Han Serif SC', 'Noto Serif SC', Georgia, serif;
  --code-font: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* 间距 */
  --content-width: 900px;
  
  /* 圆角 */
  --radius: 6px;
}
```

### 3.3 关键样式覆盖点

| 组件 | CSS 选择器 | 作用 |
|------|-----------|------|
| 文章标题 | `#post .post-title` | 文章页标题 |
| 文章内容 | `#article-container` | 正文区域 |
| 侧边栏 | `#sidebar` | 目录、分类等 |
| 导航栏 | `#nav` | 顶部导航 |
| 页脚 | `#footer` | 底部信息 |
| 卡片 | `.card-widget` | 首页卡片 |
| 代码块 | `figure.highlight` | 代码高亮 |
| 标签 | `.tag-cloud` | 标签页 |
| 分类 | `.category-lists` | 分类页 |
| 链接卡片 | `#article-container a` | 文章内链接 |

### 3.4 暗色模式适配

Butterfly 内置暗色模式，自定义样式需同时适配：

```css
/* 亮色 */
:root {
  --custom-bg: #ffffff;
  --custom-text: #1a1a2e;
  --custom-accent: #e63946;
}

/* 暗色 */
[data-theme="dark"] {
  --custom-bg: #0d1117;
  --custom-text: #c9d1d9;
  --custom-accent: #ff6b6b;
}
```

---

## 4. 字体系统

### 4.1 字体选择原则

**不要用**：Arial、Inter（过度使用）、system-ui（太无聊）

**推荐组合**（按风格）：

| 风格 | 标题字体 | 正文字体 | 代码字体 |
|------|---------|---------|---------|
| Editorial | `Playfair Display` | `Source Han Serif SC` | `JetBrains Mono` |
| Terminal | `Space Mono` | `IBM Plex Sans` | `Fira Code` |
| Refined | `Cormorant Garamond` | `DM Sans` | `JetBrains Mono` |
| Warm | `Noto Serif SC` | `Source Han Sans SC` | `JetBrains Mono` |
| Industrial | `Geist` | `Geist` | `Geist Mono` |

### 4.2 Google Fonts 引入

在 `_config.butterfly.yml` 的 `inject.custom_css` 中添加：

```yaml
inject:
  custom_css:
    - https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Han+Serif+SC:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap
```

### 4.3 字体栈示例

```css
:root {
  --font-heading: 'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-body: 'Source Han Serif SC', 'Noto Serif SC', Georgia, serif;
  --font-code: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  --font-ui: 'DM Sans', 'Noto Sans SC', sans-serif;
}
```

---

## 5. 颜色系统

### 5.1 调色板设计

不要从网上随机取色。用系统化方法：

```
主色（1个）：定义站点气质
  ↓
强调色（1个）：用于链接、按钮、高亮
  ↓
中性色（3-5个）：背景、文字、边框、次要文字
  ↓
语义色（2-3个）：成功、警告、错误
```

### 5.2 推荐调色板

#### 方案 A：温暖学术（推荐个人笔记站）

```css
:root {
  --color-bg: #faf8f5;           /* 暖白 */
  --color-surface: #f0ece6;      /* 卡片底 */
  --color-text: #2c2c2c;         /* 主文字 */
  --color-text-secondary: #6b6b6b; /* 次要文字 */
  --color-accent: #c0392b;       /* 深红强调 */
  --color-accent-light: #e74c3c; /* 浅红 */
  --color-border: #e0dbd3;       /* 边框 */
  --color-code-bg: #282c34;      /* 代码块背景 */
}

[data-theme="dark"] {
  --color-bg: #1a1a2e;
  --color-surface: #16213e;
  --color-text: #e0e0e0;
  --color-text-secondary: #a0a0a0;
  --color-accent: #e74c3c;
  --color-accent-light: #ff6b6b;
  --color-border: #2a2a4a;
  --color-code-bg: #0d1117;
}
```

#### 方案 B：精致暗色（技术感）

```css
:root {
  --color-bg: #0d1117;
  --color-surface: #161b22;
  --color-text: #c9d1d9;
  --color-text-secondary: #8b949e;
  --color-accent: #58a6ff;
  --color-accent-light: #79c0ff;
  --color-border: #30363d;
  --color-code-bg: #0d1117;
}

[data-theme="dark"] {
  --color-bg: #0d1117;
  --color-surface: #161b22;
  --color-text: #c9d1d9;
  --color-text-secondary: #8b949e;
  --color-accent: #58a6ff;
  --color-accent-light: #79c0ff;
  --color-border: #30363d;
}
```

---

## 6. 排版系统

### 6.1 字号比例

使用模块化比例（1.25 或 1.333）：

```css
:root {
  --text-xs: 0.75rem;    /* 12px - 次要标注 */
  --text-sm: 0.875rem;   /* 14px - 小字 */
  --text-base: 1rem;     /* 16px - 正文 */
  --text-lg: 1.125rem;   /* 18px - 正文强调 */
  --text-xl: 1.25rem;    /* 20px - 小标题 */
  --text-2xl: 1.5rem;    /* 24px - 标题 */
  --text-3xl: 1.875rem;  /* 30px - 大标题 */
  --text-4xl: 2.25rem;   /* 36px - 文章标题 */
  --text-5xl: 3rem;      /* 48px - 页面标题 */
}
```

### 6.2 行高与间距

```css
:root {
  --leading-tight: 1.25;    /* 标题 */
  --leading-normal: 1.6;    /* 正文 */
  --leading-relaxed: 1.8;   /* 长文阅读 */
  
  --tracking-tight: -0.02em;  /* 大标题 */
  --tracking-normal: 0;       /* 正文 */
  --tracking-wide: 0.05em;    /* 小字标注 */
}
```

### 6.3 文章正文排版

```css
#article-container {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-text);
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* 段落间距 */
#article-container p {
  margin-bottom: 1.5em;
}

/* 标题层级 */
#article-container h2 {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-top: 3em;
  margin-bottom: 1em;
  letter-spacing: var(--tracking-tight);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 0.3em;
}

#article-container h3 {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 600;
  margin-top: 2.5em;
  margin-bottom: 0.75em;
}
```

---

## 7. 组件样式

### 7.1 代码块

```css
figure.highlight {
  background: var(--color-code-bg);
  border-radius: var(--radius);
  margin: 2em 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

figure.highlight pre {
  font-family: var(--font-code);
  font-size: var(--text-sm);
  line-height: 1.6;
  padding: 1.5em;
}

/* 行号 */
figure.highlight .gutter pre {
  color: #636d83;
  border-right: 1px solid var(--color-border);
}
```

### 7.2 引用块

```css
#article-container blockquote {
  border-left: 4px solid var(--color-accent);
  background: var(--color-surface);
  padding: 1em 1.5em;
  margin: 2em 0;
  border-radius: 0 var(--radius) var(--radius) 0;
  font-style: italic;
  color: var(--color-text-secondary);
}
```

### 7.3 链接样式

```css
#article-container a {
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

#article-container a:hover {
  border-bottom-color: var(--color-accent);
}
```

### 7.4 标签云

```css
.tag-cloud a {
  display: inline-block;
  padding: 0.25em 0.75em;
  margin: 0.25em;
  background: var(--color-surface);
  border-radius: var(--radius);
  color: var(--color-text);
  font-size: var(--text-sm);
  transition: all 0.2s ease;
  border: 1px solid var(--color-border);
}

.tag-cloud a:hover {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
  transform: translateY(-2px);
}
```

---

## 8. 动效系统

### 8.1 原则

- 动效是**纪律**，不是**戏剧**
- 好的动效：澄清状态变化、减少加载焦虑、展示连续性
- 坏的动效：无目的循环、延迟用户、自我炫耀

### 8.2 推荐动效

```css
/* 页面加载 - 渐入 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-list .post {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.post-list .post:nth-child(1) { animation-delay: 0.1s; }
.post-list .post:nth-child(2) { animation-delay: 0.2s; }
.post-list .post:nth-child(3) { animation-delay: 0.3s; }

/* 卡片悬停 */
.card-widget {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-widget:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* 链接下划线动画 */
#article-container a {
  position: relative;
}

#article-container a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-accent);
  transition: width 0.3s ease;
}

#article-container a:hover::after {
  width: 100%;
}

/* 尊重用户偏好 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. 设计系统参考

从真实产品中学习，不要从 AI 生成中学习。

### 9.1 适合笔记站的参考

| 参考 | 风格 | 学什么 |
|------|------|--------|
| **Notion** | 温暖极简 | 衬线标题、留白、内容优先 |
| **Vercel** | 精致黑白 | 字体系统、间距纪律、几何感 |
| **Linear** | 暗色极简 | 动效、层级、紫色强调 |
| **Mintlify** | 文档优化 | 代码块、目录、阅读体验 |
| **Obsidian Publish** | 笔记原生 | 标签、双链、学术感 |

### 9.2 设计系统加载

```
skill_view(name="popular-web-designs", file_path="templates/notion.md")
skill_view(name="popular-web-designs", file_path="templates/vercel.md")
skill_view(name="popular-web-designs", file_path="templates/linear.app.md")
```

---

## 10. 实施流程

### 10.1 修改顺序

1. **先读源码**：读 `_config.butterfly.yml`、`themes/butterfly/source/css/` 下的变量文件
2. **确定方向**：选择审美方向（参考第 1 节）
3. **创建自定义 CSS**：`source/css/custom.css`
4. **注入配置**：修改 `_config.butterfly.yml` 的 `inject` 部分
5. **预览验证**：`hexo clean && hexo g && hexo s`
6. **检查暗色模式**：切换暗色模式验证
7. **检查响应式**：移动端、平板、桌面

### 10.2 验证清单

- [ ] 文件已写入正确路径
- [ ] CSS 语法正确
- [ ] `hexo g` 构建成功
- [ ] 页面加载无控制台错误
- [ ] 亮色模式正常
- [ ] 暗色模式正常
- [ ] 移动端正常
- [ ] 文章页排版正常
- [ ] 代码块样式正常
- [ ] 标签/分类页正常

### 10.3 输出格式

```
修改文件: /path/to/file.css
包含内容: 自定义颜色、字体、组件样式
验证状态: 构建成功，亮暗色模式正常
下一步: 可进一步优化首页卡片布局
```

---

## 11. Pitfalls

1. **不要直接改 `themes/butterfly/` 下的源文件**——用 `_config.butterfly.yml` 覆盖或 `source/css/custom.css` 注入
2. **不要同时引入太多字体**——2-3 个足矣，否则加载慢
3. **不要忽略暗色模式**——Butterfly 用户大概率会用
4. **不要过度动效**——个人笔记站需要的是安静，不是炫技
5. **不要用 `!important` 除非万不得已**——用更具体的选择器
6. **不要忘记 `prefers-reduced-motion`**——尊重用户系统设置
7. **不要忽略移动端**——Hexo Butterfly 默认是响应式的，自定义样式不能破坏它
8. **构建失败不能假装成功**——必须报告真实错误

---

## 12. Quick Reference

### 常用 Butterfly 类名

```css
/* 布局 */
#page                              /* 页面容器 */
#content-inner                     /* 内容区 */
#sidebar                           /* 侧边栏 */
#nav                               /* 导航栏 */
#footer                            /* 页脚 */

/* 文章 */
#post                              /* 文章页 */
.post-title                        /* 文章标题 */
#article-container                 /* 文章正文 */
.post-meta                         /* 文章元信息（日期、分类） */
.post-copyright                    /* 版权声明 */

/* 首页 */
#recent-posts                      /* 最近文章列表 */
.recent-post-item                  /* 单篇文章卡片 */
.card-widget                       /* 侧边栏卡片 */

/* 标签/分类 */
.tag-cloud                         /* 标签云 */
.category-lists                    /* 分类列表 */

/* 代码 */
figure.highlight                   /* 代码块 */
.line                              /* 代码行 */

/* 暗色模式 */
[data-theme="dark"]                /* 暗色模式选择器 */
```

### Butterfly inject 配置

```yaml
inject:
  head:
    - <link rel="preconnect" href="https://fonts.googleapis.com">
    - <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
  bottom:
    - <script src="/js/custom.js"></script>
  custom_css:
    - /css/custom.css
  custom_js:
    - /js/custom.js
```
