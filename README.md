# tiny-brain Releases

This repository contains public releases of tiny-brain for Claude Code.

## Quick Install (Claude Code Plugin)

```bash
# Add the marketplace (once)
/plugin marketplace add magic-ingredients/tiny-brain-releases

# Install tiny-brain
/plugin install tiny-brain@magic-ingredients

# Optional: Extended agents
/plugin install tiny-brain-agents-extended@magic-ingredients
```

## Available Plugins

### tiny-brain (v0.14.13)
AI-powered development workflows with TDD enforcement, planning, and quality tracking.

**Includes:**
- Skills: /plan, /feature, /fix, /adr
- Agents: developer, planner, reviewer
- MCP tools for personas, planning, analysis
- TDD enforcement hooks
- Real-time dashboard

### tiny-brain-agents-extended
Extended agents for advanced workflows: architect, tdd-validator, security-reviewer.

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
