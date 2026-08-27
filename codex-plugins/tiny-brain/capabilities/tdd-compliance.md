---
id: tdd-compliance
name: TDD Compliance
emoji: ✅
category: quality
version: 1.0.0
agent: tdd-compliance-reviewer
pipelines: [commit]
---

# TDD Compliance

## Description

Validates that commits follow test-driven development practices. Checks that tests were written before implementation, test coverage is adequate, and the red-green-refactor cycle was followed. Pure LLM capability — no additional packages required.

## Install

No package installation needed. This is a pure LLM capability that validates TDD practices using the tdd-compliance-reviewer agent.

1. The tdd-compliance-reviewer agent is included in the tiny-brain plugin.
2. Enable the capability in your pipeline configuration.

## Detect

- Built-in capability (always available when plugin is installed)
