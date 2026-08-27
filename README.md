# tiny-brain Releases

This repository contains public releases of tiny-brain for Claude Code and Codex.

## Quick Install (Claude Code Plugin)

```bash
# Add the marketplace (once)
/plugin marketplace add magic-ingredients/tiny-brain-releases

# Install tiny-brain
/plugin install tiny-brain@tiny-brain-marketplace
```

## Quick Install (Codex Plugin)

```bash
# Add the marketplace (once)
codex plugin marketplace add magic-ingredients/tiny-brain-releases --sparse .agents/plugins --sparse codex-plugins

# Install tiny-brain
codex plugin add tiny-brain@tiny-brain-marketplace
```

## Quick Install (CLI, non-brew)

```bash
curl -fsSL https://get.tiny-brain.com | sh
```

Preflights Node >= 18, then runs the tiny-brain install engine
(`npx -y @magic-ingredients/tiny-brain install`). If
`get.tiny-brain.com` is blocked in your environment, the same
script is served directly at
`https://raw.githubusercontent.com/magic-ingredients/tiny-brain-releases/main/install.sh`.

## tiny-brain (v0.29.1)

AI-powered development workflows with TDD enforcement, planning, and quality tracking.

**Includes:**

- **Skills (9):** `/plan`, `/feature`, `/fix`, `/spike`, `/adr`, `/plan-review`, `/quality`, `/merge`, `/install`
- **Review agents (11):** adversarial-reviewer, code-quality-reviewer, testing-reviewer, security-reviewer, performance-reviewer, tdd-compliance-reviewer, dependency-audit-reviewer, mutation-reviewer, analyzer-agent, quality-coordinator, deliverability-reviewer
- **MCP tools** for personas, analysis, quality tracking, recommendations, and configuration
- **TDD enforcement** and review-pipeline git hooks
- **Real-time dashboard** for progress and quality tracking

## Alternative Installation Methods

### MCPB Bundle
- **Latest:** [Download MCPB](./latest/tiny-brain-latest.mcpb)
- **All Versions:** [Browse Releases](https://github.com/magic-ingredients/tiny-brain-releases/releases)

```bash
curl -L -o tiny-brain.mcpb \
  "https://raw.githubusercontent.com/magic-ingredients/tiny-brain-releases/main/latest/tiny-brain-latest.mcpb"
mcpb install tiny-brain.mcpb
```

## API Endpoints

- **Latest Version Info:** `https://raw.githubusercontent.com/magic-ingredients/tiny-brain-releases/main/latest/version.json`
- **Plugin Marketplace:** `https://github.com/magic-ingredients/tiny-brain-releases`

## Documentation

Visit [tiny-brain.com](https://tiny-brain.com) for full documentation.
