# tiny-brain Releases

This repository contains public releases of tiny-brain for Claude Code.

## Quick Install (Claude Code Plugin)

```bash
# Add the marketplace (once)
/plugin marketplace add magic-ingredients/tiny-brain-releases

# Install tiny-brain (includes all 7 agents)
/plugin install tiny-brain@magic-ingredients
```

## tiny-brain (v0.15.3)

AI-powered development workflows with TDD enforcement, planning, and quality tracking.

**Includes:**
- Skills: /plan, /feature, /fix, /adr
- Agents (7 bundled): developer, planner, reviewer, architect, tdd-validator, security-reviewer, performance-engineer
- MCP tools for personas, planning, analysis
- TDD enforcement hooks
- Real-time dashboard

## Alternative Installation Methods

### DXT Extension
- **Latest:** [Download DXT](./latest/tiny-brain-latest.dxt)
- **All Versions:** [Browse Releases](./releases/)

```bash
curl -L -o tiny-brain.dxt \
  "https://raw.githubusercontent.com/magic-ingredients/tiny-brain-releases/main/latest/tiny-brain-latest.dxt"
dxt install tiny-brain.dxt
```

### NPM
```bash
npm install -g @magic-ingredients/tiny-brain-local
```

## API Endpoints

- **Latest Version Info:** `https://raw.githubusercontent.com/magic-ingredients/tiny-brain-releases/main/latest/version.json`
- **Plugin Marketplace:** `https://github.com/magic-ingredients/tiny-brain-releases`

## Documentation

Visit [tiny-brain.io](https://tiny-brain.io) for full documentation.
