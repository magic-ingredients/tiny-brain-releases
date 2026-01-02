# tiny-brain 0.14.15

**Release Date:** January 02, 2026

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
curl -L -o tiny-brain-0.14.15.dxt \
  "https://github.com/magic-ingredients/tiny-brain-releases/releases/download/v0.14.15/tiny-brain-0.14.15.dxt"

dxt install tiny-brain-0.14.15.dxt
```

### Option 3: NPM Global Install
```bash
npm install -g @magic-ingredients/tiny-brain-local@0.14.15
```

## What's Included

- **Skills:** /plan, /feature, /fix, /adr
- **Agents:** developer, planner, reviewer
- **MCP Tools:** personas, planning, analysis
- **TDD Enforcement:** Pre-commit hooks
- **Dashboard:** Real-time progress tracking

## Version Information
- **Version:** 0.14.15
- **Source Repository:** magic-ingredients/tiny-brain-local
- **Build Date:** 2026-01-02
- **Commit:** c9016c9ac89ba77c9a8f6dd19111ff3260f1387e
