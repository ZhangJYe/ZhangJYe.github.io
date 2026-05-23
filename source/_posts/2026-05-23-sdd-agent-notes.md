---
title: SDD、Prompt、Rules、AGENTS.md、Agent Skill 的关系
date: 2026-05-23 10:00:00
tags:
  - SDD
  - Agent
  - Prompt
categories:
  - AI Engineering
---

## 概述

在 AI 辅助开发的实践中，SDD（Spec-Driven Development）和 Agent 是两种核心范式。理解 Prompt、Rules、AGENTS.md、Agent Skill 等概念之间的关系，有助于更好地组织和管理 AI 辅助工作流。

## 核心概念

### SDD（Spec-Driven Development）

Spec-Driven Development 是一种以规格说明驱动的开发模式。其核心思想是：

- 先写清楚"要做什么"，再让 AI 或开发者去实现
- 规格说明本身成为可执行的蓝图
- 减少歧义，提高交付质量

### Prompt

Prompt 是与大语言模型交互的输入文本。好的 Prompt 应该：

- 明确任务目标
- 提供足够的上下文
- 指定期望的输出格式

### Rules

Rules 是约束 AI 行为的规则集合。它们通常以配置文件的形式存在，用于：

- 定义编码规范
- 约束输出格式
- 设定安全边界

### AGENTS.md

AGENTS.md 是一种约定文件，用于描述项目中 Agent 的行为规范：

- 定义 Agent 可以执行的操作
- 列出可用的工具和权限
- 说明工作流和协作方式

### Agent Skill

Agent Skill 是 Agent 能力的模块化封装：

- 每个 Skill 专注解决一类问题
- Skill 之间可以组合和复用
- 便于管理和扩展 Agent 的能力

## 它们之间的关系

```
Rules（约束层）
  └── AGENTS.md（行为规范）
        └── Agent Skill（能力模块）
              └── Prompt（交互接口）
                    └── SDD（开发范式）
```

1. **Rules** 定义全局约束
2. **AGENTS.md** 在 Rules 基础上定义 Agent 的行为规范
3. **Agent Skill** 是 Agent 能力的具体实现
4. **Prompt** 是调用 Skill 的接口
5. **SDD** 是更高层的开发方法论，指导如何组织这些元素

## 实践建议

1. 从 Rules 开始，建立项目的基本约束
2. 用 AGENTS.md 描述 Agent 的角色和权限
3. 将重复性工作封装为 Agent Skill
4. 通过 Prompt 精确调用所需的 Skill
5. 在 SDD 框架下管理整体开发流程

## 参考

- [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
- [Butterfly 主题文档](https://butterfly.js.org/)
