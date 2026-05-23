
---
title: 从 Prompt 到 SDD：我是如何用 Claude Code 搭建个人笔记站的
date: 2026-05-23 18:30:00
tags:
  - SDD
  - Claude Code
  - AI Coding
  - Hexo
  - GitHub Actions
categories:
  - AI Engineering
description: 记录一次使用 Claude Code、CLAUDE.md、Rules、Skill 和 GitHub Actions 搭建个人笔记站的完整实践，并复盘从 Prompt 到 SDD 的工程化思路。
toc: true
---

## 前言

这篇文章记录我第一次比较完整地使用 Claude Code 搭建个人笔记站的过程。

一开始我的想法很简单：我想要一个可以长期沉淀学习笔记、科研记录、面试总结和工程实践的网站。技术选型也比较直接：

- 静态博客框架：Hexo
- 主题：Butterfly
- 内容格式：Markdown
- 发布方式：GitHub Pages
- 自动部署：GitHub Actions
- AI 编程助手：Claude Code

但真正开始做之后，我发现这件事并不是简单地对 AI 说一句：

> 帮我搭一个个人博客。

如果只是这样，AI 很容易自由发挥：乱改配置、乱加依赖、忘记构建验证，或者在权限、路径、部署配置上反复出错。

所以这次实践对我来说，真正有价值的不是“搭好了一个网站”，而是我第一次比较清楚地体会到：

> AI Coding 不是让模型随便写代码，而是通过规范、规则和边界，把 AI 的行为约束在可控范围内。

这也就是我理解的 SDD：Specification-Driven Development，规范驱动开发。

---

## 一、为什么不能只靠一句 Prompt？

最开始，我对 Claude Code 的使用方式还是比较自然语言式的：

> 帮我用 Hexo + Butterfly 搭建一个个人笔记网站。

这种 Prompt 的问题是太模糊。它没有明确说明：

- 站点目标是什么；
- 是否允许自动部署；
- 是否允许 `git push`；
- 是否允许修改系统配置；
- 文章放在哪里；
- 图片资源怎么处理；
- Notion Token 能不能写进代码；
- 构建失败时应该怎么办；
- 最终如何验收。

如果这些规则不提前写清楚，AI 就只能靠自己的默认习惯去猜。而 AI 一旦开始猜，就会带来很多不确定性。

比如在这次过程中，我遇到过几个典型问题：

1. Claude Code 执行命令时需要权限确认；
2. Hexo 初始化要求空目录，但当前目录已经有文件；
3. 本地 Node/npm 环境被 Hermes 接管，导致 Claude Code 安装路径混乱；
4. GitHub Pages 仓库名和用户主页规则不一致，导致访问 404；
5. Butterfly 默认页面和头像占位图很丑，需要进一步美化；
6. 文章封面功能看起来多余，需要禁用。

这些问题都说明：AI 编程并不是“一句话生成一切”，而是一个不断把需求、规则和边界结构化的过程。

---

## 二、从 Prompt 到 CLAUDE.md：把临时指令变成项目规则

第一次真正有用的改进，是在项目根目录下创建 `CLAUDE.md`。

我把它理解成：

> `CLAUDE.md` 是 Claude Code 在当前项目中的长期规则文件。

它不是一次性 Prompt，而是告诉 Claude Code：

- 这个项目是什么；
- 使用什么技术栈；
- 允许做什么；
- 禁止做什么；
- 文件应该怎么组织；
- 构建和验证怎么做。

在我的项目里，`CLAUDE.md` 大概包含这些内容：

```md
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
```

这一步之后，我和 Claude Code 的协作方式就变了。

以前是：

> 帮我做一个网站。

现在是：

> 请读取 `CLAUDE.md`，并按照里面的规则完成任务。

这就是一个很重要的变化：Prompt 不再是零散的口头指令，而是进入了项目文件，成为可复用、可审查、可维护的规则。

---

## 三、Rules：让 AI 不再自由发挥

在这次实践中，我对 Rules 的理解更具体了。

Rules 不是业务需求，也不是具体任务，而是长期约束 AI 行为的项目规矩。

比如：

- 不要自动部署；
- 不要自动 `git push`；
- 不要写入真实密钥；
- 不要修改系统级配置；
- 不要删除用户已有内容；
- 构建失败不能假装成功。

这些规则看起来简单，但非常重要。因为 Claude Code 是可以读文件、写文件、执行命令的。如果没有边界，它可能会做出一些你并不想让它做的事情。

我现在对 Prompt 和 Rules 的区分是：

| 类型 | 作用 |
|---|---|
| Prompt | 告诉 AI 这次任务要做什么 |
| Rules | 告诉 AI 做任何任务时都必须遵守什么 |

例如：

```text
Prompt：请帮我配置 GitHub Actions 自动部署 Hexo 到 GitHub Pages。
Rules：不要自动 git push，不要写入密钥，不要自动部署，不要修改系统配置。
```

所以，真正可控的 AI Coding，不能只有 Prompt，还要有 Rules。

---

## 四、Spec：先定义清楚，再让 AI 实现

在搭建网站时，我也逐渐意识到，很多问题不是代码问题，而是需求没有定义清楚。

比如“个人笔记网站”这个需求，其实可以继续拆成：

- 使用什么框架？
- 使用什么主题？
- 内容来源是什么？
- 是否支持 Notion？
- 文章目录怎么设计？
- 发布方式是什么？
- GitHub Pages 使用用户站点还是项目站点？
- `_config.yml` 里的 `url` 和 `root` 应该怎么配置？
- 是否需要文章封面？
- 是否需要评论系统？
- 是否需要 PWA？

如果这些没有提前定义，Claude Code 就会自己补全，而它补全出来的结果不一定符合我的预期。

所以 Spec 的作用就是：

> 先把“要做什么”写清楚，再让 AI 去做。

在这个项目里，最简化的 Spec 是这样的：

```text
目标：
搭建一个个人知识笔记网站，用于沉淀学习笔记、技术文章、科研记录、面试总结和项目复盘。

技术方案：
- Hexo
- Butterfly
- Markdown
- GitHub Pages
- GitHub Actions

验收标准：
1. 可以本地 npm run build。
2. 可以本地 npm run dev。
3. GitHub Pages 可以访问。
4. 有 README.md。
5. 有 .env.example。
6. 不包含真实密钥。
```

这让我理解到：SDD 的核心不是文档越多越好，而是关键决策必须提前结构化。

---

## 五、Skill：把能力从 Prompt 里抽出来

后面做网站美化时，我又引入了一个前端设计 Skill：

```text
.skills/frontend-design/SKILL.md
```

这个 Skill 不是具体任务，而是告诉 Claude Code：

- 这个网站应该是什么风格；
- 什么样的设计是合适的；
- 不要使用随机外链图片；
- 不要加过度动画；
- 不要破坏 Butterfly 结构；
- 优先通过配置完成美化；
- 站点定位是技术笔记、科研记录、AIOps、Agent 和 Go 后端。

它的作用类似于给 Claude Code 一个可复用的“前端设计能力说明书”。

我发现 Skill 和 Prompt 的区别也很明显：

| 类型 | 作用 |
|---|---|
| Prompt | 这次具体要做什么 |
| Skill | 遇到某类任务时，应该按什么能力规范做 |

比如我发给 Claude Code 的任务是：

> 请基于当前 Hexo + Butterfly 项目，做第二阶段网站基础美化，并使用前端设计 Skill。

这样 Claude Code 就不会只机械地改配置，而是会先参考 `.skills/frontend-design/SKILL.md` 里的风格约束。

这让我理解到 Agent Skill 的意义：

> 能力不应该一直藏在 Prompt 里，而应该沉淀成可发现、可复用的工程制品。

---

## 六、环境问题：AI Coding 也绕不开基础工程能力

这次过程中，一个很真实的坑是 Node 环境。

一开始 Claude Code 命令突然不能用了：

```bash
which claude
claude not found
```

后来发现：

- `node` 和 `npm` 被 Hermes 接管；
- `npm prefix -g` 指向了 `~/.hermes/node`；
- Claude Code 被安装到了 Hermes 的 Node 环境里；
- 二进制权限和路径出现问题；
- 最后通过安装 nvm，把正常开发 Node 和 Hermes Node 分离。

最终修复后的状态是：

```text
node: v22.22.3 via nvm
npm: v10.9.8
claude: 2.1.148
nvm default -> 22
```

这件事给我的提醒是：

> AI Coding 并不会消除工程环境问题。相反，当 AI 能执行命令时，环境治理会变得更重要。

如果本地环境混乱，AI 也会在混乱的环境里继续放大问题。

所以我现在更认可这种分层：

```text
Hermes 用自己的 Node
正常开发用 nvm Node
Claude Code 安装到 nvm 环境
不要让 ~/.hermes/node/bin 永远排在 PATH 最前面
```

这也是工程化的一部分。

---

## 七、GitHub Pages：仓库命名也属于规范

另一个坑是 GitHub Pages 访问 404。

我一开始创建的仓库地址是：

```text
https://github.com/ZhangJYe/zhangjinye.github.io.git
```

然后访问：

```text
https://zhangjinye.github.io
```

结果是 404。

后来才确认 GitHub Pages 的个人主页仓库必须符合：

```text
用户名.github.io
```

我的 GitHub 用户名是：

```text
ZhangJYe
```

所以仓库应该叫：

```text
ZhangJYe.github.io
```

最终访问地址是：

```text
https://ZhangJYe.github.io
```

同时 Hexo 的 `_config.yml` 也要配置成：

```yaml
url: https://ZhangJYe.github.io
root: /
```

这件事让我意识到：部署配置不是小细节，而是规范的一部分。

尤其是 Hexo 这种静态站，如果 `url` 和 `root` 配错，页面、CSS、图片路径都可能出问题。

---

## 八、GitHub Actions：发布流程自动化

网站本地能跑之后，我使用 GitHub Actions 做自动部署。

整体流程是：

```text
本地写 Markdown
      ↓
git commit
      ↓
git push
      ↓
GitHub Actions 自动 npm ci
      ↓
npm run build
      ↓
发布 public/ 到 GitHub Pages
```

这里我给 Claude Code 的约束是：

- 可以帮我创建 `.github/workflows/deploy.yml`；
- 可以运行 `npm run build`；
- 不要自动 `git push`；
- 不要写入密钥。

我现在比较推荐的工作流是：

```text
Claude Code 修改代码
      ↓
npm run build 通过
      ↓
Claude Code 可以本地 git commit
      ↓
我手动 git push
      ↓
GitHub Actions 自动部署
```

原因是：

> commit 是本地存档，push 是上线发布。自动 commit 可以接受，自动 push 应该谨慎。

---

## 九、从“搭网站”到“建立写作系统”

网站搭起来之后，我发现下一步不应该是继续堆功能，而是建立写作系统。

因为个人笔记站真正的核心不是主题多漂亮，也不是功能多复杂，而是：

> 我能不能长期稳定地写、整理、发布和复盘。

所以后续我更应该优化：

- 文章模板；
- 分类规范；
- 标签规范；
- 图片插入规范；
- Markdown 写作流程；
- GitHub Pages 发布流程；
- Notion 同步策略。

比如文章模板可以统一成：

```yaml
---
title:
date:
tags:
categories:
description:
toc: true
---
```

我也暂时不使用文章封面字段，因为我发现封面图对技术笔记来说不是刚需，反而容易增加维护成本。

---

## 十、我对 SDD 的理解

经过这次实践，我对 SDD 的理解更具体了。

以前我以为 SDD 就是“先写需求文档，再写代码”。

现在我觉得它更像是：

> 把 AI 编程中容易漂移、容易猜测、容易失控的部分，提前写成规范。

在这个项目里，各类文件的分工是：

| 文件 / 概念 | 作用 |
|---|---|
| `CLAUDE.md` | 项目规则，约束 Claude Code 怎么工作 |
| `docs/specs/` | 需求规范，定义要做什么 |
| `prompts/` | 可复用任务 Prompt |
| `.skills/` | 可复用能力说明 |
| `.github/workflows/` | 自动化发布流程 |
| `README.md` | 人类可读的使用说明 |
| `_config.yml` | Hexo 站点配置 |
| `_config.butterfly.yml` | Butterfly 主题配置 |

这套东西组合起来，才让 AI Coding 从“凭感觉对话”变成“可控协作”。

我现在对几个概念的理解是：

```text
Prompt：这次任务怎么说
Rules：项目长期要遵守什么
Spec：系统到底要做什么
Skill：某类能力如何复用
AGENTS.md：智能体如何工作、交付和被约束
Workflow：任务如何自动化执行
```

---

## 十一、这次实践的收获

这次搭建个人笔记站，表面上是完成了一个 Hexo + Butterfly 网站。

但更重要的收获是：

1. AI Coding 需要规则，而不是只靠自然语言。
2. `CLAUDE.md` 可以作为 Claude Code 的项目级规则入口。
3. Skill 可以把审美、流程、能力从 Prompt 中抽离出来。
4. GitHub Actions 让发布流程自动化，但 push 仍然应该由人控制。
5. 环境治理很重要，Node/npm 混乱会直接影响 AI Coding。
6. 个人网站的核心不是功能，而是长期写作体系。
7. SDD 的本质是让 AI 协作从“氛围”变成“结构”。

---

## 总结

这次实践让我真正理解了：

> AI 编程不是让模型变得无所不能，而是通过规范、上下文、规则和工作流，让模型在确定的边界内稳定工作。

从 Prompt 到 SDD，本质上是一次思维方式的变化：

```text
从：我随便说一句，AI 帮我做
到：我先定义规则、边界和验收标准，再让 AI 执行
```

个人笔记站只是一个很小的项目，但它很好地体现了 AI Coding 的工程化路径：

```text
Prompt → Rules → Spec → Skill → Workflow → 可运行系统
```

后续我会继续把这个网站作为自己的技术知识库，用来记录：

- AIOps 与 Agent 的研究；
- Go 后端工程实践；
- AI Coding 和 SDD 方法论；
- 面试与项目复盘；
- 论文阅读与科研思考。

对我来说，这个网站不只是一个博客，而是一个长期的个人知识系统。
