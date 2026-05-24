---
title: "Notion 同步测试文章"
date: 2026-05-24 00:00:00
tags:
  - Notion
  - Hexo
categories:
  - AI Engineering
description: "这是一篇用于测试 Notion 同步到 Hexo 的文章。"
toc: true
notion_id: 36a31f0d-1085-80fe-bd92-d7873647d037
---

# 这是测试文章
这是一篇从 Notion 同步到 Hexo 的测试文章。
它的目的不是正式发布，而是用来验证：
- Notion 页面能否被脚本读取；
- Notion 字段能否转换成 Hexo Front Matter；
- 正文能否转换成 Markdown；
- 最终能否生成到 `source/_posts/notion-sync-test.md`。
## 测试列表
- 测试列表 1
- 测试列表 2
- 测试列表 3
## 测试代码块
```go
package main

import "fmt"

func main() {
    fmt.Println("hello notion")
}
```
## 测试引用
> 这是引用测试。后续同步脚本应该把它转换成 Markdown blockquote。
## 测试结论
如果这篇文章能被同步到 Hexo，并且本地 `npm run build` 成功，就说明 Notion 到 Hexo 的第一版同步链路已经跑通。

