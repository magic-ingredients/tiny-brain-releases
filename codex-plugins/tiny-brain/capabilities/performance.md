---
id: performance
name: Performance Review
emoji: ⚡
category: quality
version: 1.0.0
agent: performance-reviewer
pipelines: [quality, commit, push]
---

# Performance Review

## Description

Automated performance review of code changes. Analyzes commits for performance regressions, inefficient patterns, and optimization opportunities. Pure LLM capability — no additional packages required.

## Install

No package installation needed. This is a pure LLM capability that analyzes code for performance issues using the performance-reviewer agent.

1. The performance-reviewer agent is included in the tiny-brain plugin.
2. Enable the capability in your pipeline configuration.

## Detect

- Built-in capability (always available when plugin is installed)
