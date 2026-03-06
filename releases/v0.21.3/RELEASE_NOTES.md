# tiny-brain 0.21.3

**Release Date:** March 06, 2026

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
curl -L -o tiny-brain-0.21.3.dxt \
  "https://github.com/magic-ingredients/tiny-brain-releases/releases/download/v0.21.3/tiny-brain-0.21.3.dxt"

dxt install tiny-brain-0.21.3.dxt
```

### Option 3: NPM Global Install
```bash
npm install -g @magic-ingredients/tiny-brain-local@0.21.3
```

## What's Included

- **Skills:** /plan, /feature, /fix, /adr
- **Agents (7 bundled):** developer, planner, reviewer, architect, tdd-validator, security-reviewer, performance-engineer
- **MCP Tools:** personas, planning, analysis
- **TDD Enforcement:** Pre-commit hooks
- **Dashboard:** Real-time progress tracking

## Version Information
- **Version:** 0.21.3
- **Source Repository:** magic-ingredients/tiny-brain-local
- **Build Date:** 2026-03-06
- **Commit:** faa834db902ab615db507e95a86b7a49771d948b
