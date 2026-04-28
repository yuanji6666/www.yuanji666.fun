---
title: 从Claude Code看Harness工程最佳实践
publishDate: 2026-04-20 14:50:00
description: Claude Code源码背后的Harness工程取舍剖析
tags:
  - AI
  - Harness 
language: 中文
---
# 架构全景

![[image.png]]

# 一些启发

设计一个Harness，可以拿人做类比：LLM是大脑，核心状态循环是神经系统，工具系统是四肢，Agent协作自然就是一群人一块干活。这不仅帮助我们形象地理解Agent，而且能够启发我们从人的角度出发思考一些设计而非过度设计。

# 神经系统—QueryEngine

维护整个对话的进行

## 核心循环：query.ts 状态机

其实就是While True 一个 **ReAct Loop**，ReAct Loop已经成为Agent范式的一个共识

## 上下文管理：动态拼装

Anthropic API是支持缓存的，因此在system prompt里有一个静态分隔符

## Token管理：三层降级压缩

MicroCompact->后台压缩->全量摘要

- MicroCompact 重点是工具消息
- 后台压缩：自动触发，用户无感
- 全量摘要：兜底

## 长期记忆写入和治理

- memory tool 要求Agent**自主**调用记忆——效果不好，主动意愿不高
- 专用extract agent 总结整个message，针对性强，意愿高
- (preview)Auto Dream——想象人类晚上做梦，识别-收集-整合-清理

# 四肢—工具系统

## Build-in Tools

- Bash Tool 绝对核心，安全限制关注重点
- read/edit 高频工具专有化
- Grep/Glob 搜索工具选型，返璞归真
- Agent Tool 分配任务
## MCP
## Skills

# Team Work—Agent协作

已实现：
- Sub Agent 空白上下文
- Type Sub Agent 特定Prompt，完成特定任务
- Fork Agent fork父agent上下文
探索：
- 编排模式-主Agent只编排不执行，把所用逻辑能力花在思考
- Swarm/Team-real TeamWork lead_agent可以广播，agent之间可以私信
# 安全—生产核心

多层纵深防御，沙箱兜底