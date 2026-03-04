# tiny-brain 0.21.1

**Release Date:** March 04, 2026

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
curl -L -o tiny-brain-0.21.1.dxt \
  "https://github.com/magic-ingredients/tiny-brain-releases/releases/download/v0.21.1/tiny-brain-0.21.1.dxt"

dxt install tiny-brain-0.21.1.dxt
```

### Option 3: NPM Global Install
```bash
npm install -g @magic-ingredients/tiny-brain-local@0.21.1
```

## What's Included

- **Skills:** /plan, /feature, /fix, /adr
- **Agents (7 bundled):** developer, planner, reviewer, architect, tdd-validator, security-reviewer, performance-engineer
- **MCP Tools:** personas, planning, analysis
- **TDD Enforcement:** Pre-commit hooks
- **Dashboard:** Real-time progress tracking

## Version Information
- **Version:** 0.21.1
- **Source Repository:** magic-ingredients/tiny-brain-local
- **Build Date:** 2026-03-04
- **Commit:** f9721109d12f6fca15ea245f80c619258e11856e
