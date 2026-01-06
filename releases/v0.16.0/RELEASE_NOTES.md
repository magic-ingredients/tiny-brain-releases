# tiny-brain 0.16.0

**Release Date:** January 06, 2026

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
curl -L -o tiny-brain-0.16.0.dxt \
  "https://github.com/magic-ingredients/tiny-brain-releases/releases/download/v0.16.0/tiny-brain-0.16.0.dxt"

dxt install tiny-brain-0.16.0.dxt
```

### Option 3: NPM Global Install
```bash
npm install -g @magic-ingredients/tiny-brain-local@0.16.0
```

## What's Included

- **Skills:** /plan, /feature, /fix, /adr
- **Agents (7 bundled):** developer, planner, reviewer, architect, tdd-validator, security-reviewer, performance-engineer
- **MCP Tools:** personas, planning, analysis
- **TDD Enforcement:** Pre-commit hooks
- **Dashboard:** Real-time progress tracking

## Version Information
- **Version:** 0.16.0
- **Source Repository:** magic-ingredients/tiny-brain-local
- **Build Date:** 2026-01-06
- **Commit:** ce2a7f2143dd79216be5f1344b3bbddea4b2e339
