# tiny-brain 0.14.12

**Release Date:** January 01, 2026

## Installation Options

### Option 1: Claude Code Plugin (Recommended)
```bash
# Add the tiny-brain marketplace (once)
/plugin marketplace add magic-ingredients/tiny-brain-releases

# Install the plugin
/plugin install tiny-brain@magic-ingredients

# Optional: Install extended agents
/plugin install tiny-brain-agents-extended@magic-ingredients
```

### Option 2: DXT Extension
```bash
curl -L -o tiny-brain-0.14.12.dxt \
  "https://github.com/magic-ingredients/tiny-brain-releases/releases/download/v0.14.12/tiny-brain-0.14.12.dxt"

dxt install tiny-brain-0.14.12.dxt
```

### Option 3: NPM Global Install
```bash
npm install -g @magic-ingredients/tiny-brain-local@0.14.12
```

## What's Included

- **Skills:** /plan, /feature, /fix, /adr
- **Agents:** developer, planner, reviewer
- **MCP Tools:** personas, planning, analysis
- **TDD Enforcement:** Pre-commit hooks
- **Dashboard:** Real-time progress tracking

## Version Information
- **Version:** 0.14.12
- **Source Repository:** magic-ingredients/tiny-brain-local
- **Build Date:** 2026-01-01
- **Commit:** 4953c07fbfcbe5791fd27ab72c0e3000bba69b2a
