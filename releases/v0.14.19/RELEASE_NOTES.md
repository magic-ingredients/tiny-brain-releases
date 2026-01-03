# tiny-brain 0.14.19

**Release Date:** January 03, 2026

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
curl -L -o tiny-brain-0.14.19.dxt \
  "https://github.com/magic-ingredients/tiny-brain-releases/releases/download/v0.14.19/tiny-brain-0.14.19.dxt"

dxt install tiny-brain-0.14.19.dxt
```

### Option 3: NPM Global Install
```bash
npm install -g @magic-ingredients/tiny-brain-local@0.14.19
```

## What's Included

- **Skills:** /plan, /feature, /fix, /adr
- **Agents:** developer, planner, reviewer
- **MCP Tools:** personas, planning, analysis
- **TDD Enforcement:** Pre-commit hooks
- **Dashboard:** Real-time progress tracking

## Version Information
- **Version:** 0.14.19
- **Source Repository:** magic-ingredients/tiny-brain-local
- **Build Date:** 2026-01-03
- **Commit:** a9b464bba46700ebd8cca27d75a187b177eee6ff
