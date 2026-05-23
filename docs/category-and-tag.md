# 分类与标签规范

## 设计原则

- **分类（categories）**：粗粒度，用于组织文章的大方向，每篇文章只归一个分类
- **标签（tags）**：细粒度，用于标记文章涉及的具体技术点，每篇文章可以有多个标签

## 分类体系

| 分类 | 说明 |
|------|------|
| `AI Engineering` | AI 工程化落地：SDD、Prompt Engineering、RAG、MCP |
| `AIOps` | 智能运维：异常检测、根因分析、自动修复、可观测性 |
| `Agent` | Agent 框架、多 Agent 协作、工具调用、Agent Skill |
| `Golang` | Go 语言学习、标准库、并发模式、性能优化 |
| `Backend` | 后端架构、微服务、数据库、缓存、消息队列 |
| `Research` | 论文阅读、技术报告、学术研究笔记 |
| `Interview` | 面试准备、八股文、手撕代码、系统设计 |
| `English` | 英语学习、技术文档阅读、术语积累 |
| `Life` | 随笔、思考、总结、非技术内容 |

新增分类前，先确认现有分类无法归类，再添加。

## 标签体系

标签按用途分组，可以自由组合：

### AI & Agent

`SDD` `Claude Code` `Agent Skill` `AGENTS.md` `RAG` `MCP` `AIOps` `LLM` `Prompt` `Embedding`

### 后端 & 基础设施

`Go` `Redis` `MySQL` `Kubernetes` `Docker` `gRPC` `Gin` `微服务` `并发`

### 工具 & 平台

`Hexo` `Git` `GitHub Actions` `Vim` `Cursor` `Notion`

### 概念 & 方法

`设计模式` `架构` `性能优化` `可观测性` `系统设计`

## 命名规范

1. 分类使用**英文**，简洁明确，首字母大写
2. 标签优先使用**英文**，专有名词保持原样（如 `Go`、`RAG`、`MCP`）
3. 多单词标签使用**空格**分隔（如 `Claude Code`、`Agent Skill`）
4. 不使用过长的标签名（不超过 3 个单词）

## 示例

```markdown
---
title: 使用 Go 实现 RAG 检索服务
date: 2026-05-23 10:00:00
tags:
  - Go
  - RAG
  - MCP
categories:
  - Backend
description: 基于 Go 实现的 RAG 检索服务，支持向量检索和混合检索。
toc: true
---
```

```markdown
---
title: Agent 论文阅读：ReAct
date: 2026-05-20 10:00:00
tags:
  - Agent
  - LLM
  - SDD
categories:
  - Research
description: ReAct 论文解读，理解推理与行动的结合方式。
toc: true
---
```

```markdown
---
title: Go 并发面试题整理
date: 2026-05-18 10:00:00
tags:
  - Go
  - 并发
categories:
  - Interview
description: Go 并发常见面试题和手撕代码练习。
toc: true
---
```

## 维护

- 定期审视标签列表，合并重复或近义标签
- 每季度检查分类是否仍然合理
- 如果某个标签使用超过 5 篇文章，考虑是否应提升为分类
