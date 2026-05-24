# 分类与标签规范

## 设计原则

- **分类（categories）**：粗粒度，每篇文章只归一个分类，代表文章的核心方向
- **标签（tags）**：细粒度，标记文章涉及的具体技术点，每篇文章 2-4 个标签

---

## 分类体系

| 分类 | 说明 | 适用范围 |
|------|------|----------|
| `AI Engineering` | AI 工程化落地 | SDD、Prompt Engineering、RAG、MCP、AI 辅助开发工作流、工程化 Agent 框架 |
| `AIOps` | 智能运维 | 异常检测、根因分析、告警收敛、可观测性、日志分析、自动化运维 |
| `Agent` | Agent 研究与工程 | 多 Agent 协作、工具调用、Agent Skill、ReAct、Function Calling |
| `Golang` | Go 语言 | 标准库、并发模式、性能优化、GC、编译器、语言特性 |
| `Backend` | 后端工程 | 微服务架构、数据库、缓存、消息队列、API 设计、分布式系统 |
| `Research` | 学术研究 | 论文阅读笔记、技术报告、会议解读、领域综述 |
| `Interview` | 面试准备 | 八股文、手撕代码、系统设计、场景题、面经复盘 |
| `English` | 英语学习 | 技术文档精读、术语积累、写作练习 |
| `Life` | 随笔 | 阶段总结、工具推荐、思考感悟、非技术内容 |

### 新增分类规则

新增分类前必须满足：

1. 现有分类确实无法归类
2. 预计至少会有 5 篇以上文章
3. 和现有分类没有大面积重叠

### 各分类示例文章

**AI Engineering**
- 从 Prompt 到 SDD：用 Claude Code 搭建个人笔记站
- RAG 工程化实践：检索、重排、生成的完整链路
- MCP 协议设计与工具调用标准化

**AIOps**
- 基于 LSTM 的时序异常检测实践
- 告警收敛算法设计与优化
- 可观测性三大支柱：Metrics、Logs、Traces

**Agent**
- SDD、Prompt、Rules、AGENTS.md、Agent Skill 的关系
- ReAct 论文解读：推理与行动的结合
- 多 Agent 协作框架设计

**Golang**
- Go channel 底层实现与调度原理
- Go GC 三色标记法详解
- Gin 框架中间件设计模式

**Backend**
- Redis 缓存穿透、击穿、雪崩的解决方案
- MySQL 索引优化与慢查询分析
- 微服务间通信：gRPC vs REST

**Research**
- Agent 论文阅读：Toolformer
- AIOps 综述：智能运维的现状与挑战
- LLM 推理优化：vLLM 与 PagedAttention

**Interview**
- Go 并发面试题整理
- 系统设计：短链接服务
- 手撕 LRU Cache

**English**
- 论文精读中的高频术语整理
- 技术博客英文写作常用句式

**Life**
- 关于这个笔记站
- 2026 上半年学习复盘

---

## 标签体系

### 标签列表

按用途分组，文章中自由组合：

**AI & Agent**

`SDD` `Claude Code` `Agent Skill` `AGENTS.md` `RAG` `MCP` `LLM` `Prompt` `Embedding` `Function Calling`

**后端 & 基础设施**

`Go` `Redis` `MySQL` `Kubernetes` `Docker` `gRPC` `Gin` `微服务` `并发` `消息队列`

**工具 & 平台**

`Hexo` `Git` `GitHub Actions` `Vim` `Cursor` `Notion`

**概念 & 方法**

`设计模式` `架构` `性能优化` `可观测性` `系统设计` `异常检测`

### 标签防泛滥原则

1. **不造近义标签**：已有 `Go` 就不加 `Golang`、`golang`；已有 `并发` 就不加 `concurrency`
2. **不为单篇文章造标签**：一个标签至少预计会用 3 次以上才创建
3. **控制每篇文章标签数**：2-4 个为宜，不超过 5 个
4. **定期清理**：每季度检查一次，合并重复或近义标签
5. **标签是技术点，不是描述**：用 `Redis` 而不是 `缓存学习笔记`；用 `Agent` 而不是 `AI研究`

### 标签 vs 分类的边界

- 文章讲"用 Go 实现 RAG" → 分类 `Backend` 或 `AI Engineering`，标签 `Go` `RAG`
- 文章讲"RAG 论文综述" → 分类 `Research`，标签 `RAG` `LLM`
- 文章讲"Agent 面试题" → 分类 `Interview`，标签 `Agent` `LLM`

核心判断：**分类看"这篇文章属于哪个领域"，标签看"这篇文章涉及哪些技术"**。

---

## 命名规范

1. 分类使用**英文**，首字母大写（`AI Engineering`、`AIOps`）
2. 标签优先使用**英文**，专有名词保持原样（`Go`、`RAG`、`MCP`）
3. 多单词标签用**空格**分隔（`Claude Code`、`Agent Skill`、`GitHub Actions`）
4. 不使用过长的标签名（不超过 3 个单词）

---

## 快速参考

写文章时，先确定分类，再选 2-4 个标签：

```
这篇文章属于哪个领域？ → 分类
这篇文章涉及哪些技术？ → 标签（2-4 个）
```

完整标签列表见上方"标签体系"一节。
