# tiny-brain 0.26.1

**Release Date:** July 10, 2026

## Installation Options

### Option 1: Claude Code Plugin (Recommended)
```bash
# Add the tiny-brain marketplace (once)
/plugin marketplace add magic-ingredients/tiny-brain-releases

# Install the plugin (includes all 7 agents)
/plugin install tiny-brain@tiny-brain-marketplace
```

### Option 2: MCPB Bundle
```bash
curl -L -o tiny-brain-0.26.1.mcpb \
  "https://github.com/magic-ingredients/tiny-brain-releases/releases/download/v0.26.1/tiny-brain-0.26.1.mcpb"

mcpb install tiny-brain-0.26.1.mcpb
```

## What's Included

- **Skills:** /plan, /feature, /fix, /adr
- **Agents (7 bundled):** developer, planner, reviewer, architect, tdd-validator, security-reviewer, performance-engineer
- **MCP Tools:** personas, planning, analysis
- **TDD Enforcement:** Pre-commit hooks
- **Dashboard:** Real-time progress tracking

## Version Information
- **Version:** 0.26.1
- **Source Repository:** magic-ingredients/tiny-brain-local
- **Build Date:** 2026-07-10
- **Commit:** 296bf54f55e45e7f8bf0815d05ab69cb92ca3181
