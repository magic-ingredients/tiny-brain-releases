# tiny-brain 0.22.11

**Release Date:** May 01, 2026

## Installation Options

### Option 1: Claude Code Plugin (Recommended)
```bash
# Add the tiny-brain marketplace (once)
/plugin marketplace add magic-ingredients/tiny-brain-releases

# Install the plugin (includes all 7 agents)
/plugin install tiny-brain@magic-ingredients
```

### Option 2: DXT Extension
```bash
curl -L -o tiny-brain-0.22.11.dxt \
  "https://github.com/magic-ingredients/tiny-brain-releases/releases/download/v0.22.11/tiny-brain-0.22.11.dxt"

dxt install tiny-brain-0.22.11.dxt
```

### Option 3: NPM Global Install
```bash
npm install -g @magic-ingredients/tiny-brain-local@0.22.11
```

## What's Included

- **Skills:** /plan, /feature, /fix, /adr
- **Agents (7 bundled):** developer, planner, reviewer, architect, tdd-validator, security-reviewer, performance-engineer
- **MCP Tools:** personas, planning, analysis
- **TDD Enforcement:** Pre-commit hooks
- **Dashboard:** Real-time progress tracking

## Version Information
- **Version:** 0.22.11
- **Source Repository:** magic-ingredients/tiny-brain-local
- **Build Date:** 2026-05-01
- **Commit:** 335260447c832c2239ac83a570c24f728a9b4b6c
