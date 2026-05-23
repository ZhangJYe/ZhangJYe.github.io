# 分类与标签规范

## 设计原则

- **分类（categories）**：粗粒度，用于组织文章的大方向，每篇文章只有一个分类
- **标签（tags）**：细粒度，用于标记文章涉及的具体技术点，每篇文章可以有多个标签

## 分类体系

| 分类 | 说明 |
|------|------|
| `AI工程` | AI 工程化落地：Agent、RAG、Prompt Engineering、SDD |
| `AIOps` | 智能运维：异常检测、根因分析、自动修复、可观测性 |
| `Go后端` | Go 语言后端开发：微服务、高性能、并发、数据库 |
| `工具链` | 开发工具、CI/CD、编辑器、CLI 工具 |
| `论文笔记` | 论文阅读笔记、技术报告解读 |
| `随笔` | 思考、总结、非技术内容 |

新增分类前，先确认现有分类无法归类，再添加。

## 标签体系

标签按用途分为几类，可以自由组合：

### 技术栈标签

`Go` `Python` `Docker` `Kubernetes` `MySQL` `Redis` `gRPC` `Gin` `Hexo`

### AI 相关标签

`Agent` `RAG` `Prompt` `SDD` `LLM` `Embedding` `Fine-tuning` `AIOps`

### 概念标签

`微服务` `并发` `设计模式` `架构` `性能优化` `可观测性`

### 工具标签

`Claude Code` `Cursor` `Git` `GitHub Actions` `Vim`

## 命名规范

1. 分类使用**中文**，简洁明确
2. 标签优先使用**英文**，专有名词保持原样（如 `Go`、`RAG`、`LLM`）
3. 多单词标签使用**驼峰**或**空格**分隔，保持一致
4. 不使用过长的标签名（不超过 4 个字/词）

## 示例

```markdown
---
title: 使用 Go 实现 RAG 检索服务
date: 2026-05-23 10:00:00
tags:
  - Go
  - RAG
  - 检索
  - 微服务
categories:
  - Go后端
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
  - 论文笔记
categories:
  - 论文笔记
description: ReAct 论文解读，理解推理与行动的结合方式。
toc: true
---
```

## 维护

- 定期审视标签列表，合并重复或近义标签
- 每季度检查分类是否仍然合理
- 如果某个标签使用超过 5 篇文章，考虑是否应提升为分类
