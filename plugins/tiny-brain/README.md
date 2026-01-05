# Tiny Brain Plugin for Claude Code

AI-powered development workflows with TDD enforcement, planning, and quality tracking.

## Features

### Free Tier (Full Local Functionality)

- **MCP Server** - Full Model Context Protocol integration
- **Dashboard** - Real-time progress tracking and visualization
- **Skills** - `/plan`, `/feature`, `/fix`, `/adr` commands
- **Hooks** - TDD enforcement and dev enhancement hooks
- **Agents** - Core bundled agents for development workflows

### Pro Tier (Cloud Features)

- **Cloud Sync** - Sync personas, agents, and skills across machines
- **Quality Trends** - Historical quality analysis and regression alerts
- **Cross-Machine History** - Access your work from anywhere
- **Team Features** - Collaboration and shared configurations

## Installation

```bash
# 1. Add the tiny-brain marketplace (once)
/plugin marketplace add https://github.com/magic-ingredients/tiny-brain-releases

# 2. Install the plugin
/plugin install tiny-brain@magic-ingredients
```

### Alternative Installation

```bash
# Via npm (for CLI usage)
npm install -g @magic-ingredients/tiny-brain-plugin
```

## Quick Start

1. **Analyze your repository**
   ```
   /analyse
   ```
   This detects your tech stack and recommends agents.

2. **Create a PRD**
   ```
   /plan
   ```
   Interactively plan a new feature or product.

3. **Add features**
   ```
   /feature
   ```
   Add features to an existing PRD.

4. **Track fixes**
   ```
   /fix
   ```
   Document and track bug fixes with TDD workflow.

## Skills

| Skill | Description |
|-------|-------------|
| `/plan` | Create Product Requirements Documents |
| `/feature` | Add features to existing PRDs |
| `/fix` | Track bug fixes with test plans |
| `/adr` | Create Architecture Decision Records |

## Dashboard

Access the dashboard to visualize your progress:

```bash
# Opens automatically when using plan operations
# Or manually:
tiny-brain dashboard
```

## Configuration

### Activate Pro Features

```
/setup-pro
```

Follow the prompts to connect your account and enable cloud sync.

### Preferences

```bash
# Enable auto-commit for progress tracking
tiny-brain config preferences set autoCommitProgress true

# Check current preferences
tiny-brain config preferences list
```

## TDD Workflow

Tiny Brain enforces Test-Driven Development:

1. **Red Phase** (`test:` commits) - Write failing tests first
2. **Green Phase** (`feat:` commits) - Implement to pass tests
3. **Refactor Phase** (`refactor:` commits) - Clean up code

Commits are automatically tracked in progress.json files.

## License

MIT
