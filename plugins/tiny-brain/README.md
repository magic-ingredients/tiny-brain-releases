# Tiny Brain Plugin for Claude Code

AI-powered development workflows with TDD enforcement, planning, and quality tracking.

## Installation

```bash
# 1. Add the marketplace (once)
/plugin marketplace add magic-ingredients/tiny-brain-releases

# 2. Install the plugin
/plugin install tiny-brain@tiny-brain-marketplace
```

## What's Included

### Skills (5)

| Skill | Command | Description |
|-------|---------|-------------|
| Plan | `/plan` | Create Product Requirements Documents with features and tasks |
| Feature | `/feature` | Add features to an existing PRD |
| Fix | `/fix` | Document and track bug fixes with TDD workflow |
| ADR | `/adr` | Create Architecture Decision Records |
| Quality | `/quality` | Run comprehensive code quality analysis |

### Agents (7)

| Agent | Description |
|-------|-------------|
| `tiny-brain:planner` | PRD and feature planning specialist |
| `tiny-brain:reviewer` | Code review and quality feedback (read-only) |
| `tiny-brain:architect` | System design, ADRs, and technical decisions |
| `tiny-brain:tdd-validator` | TDD compliance validation and enforcement |
| `tiny-brain:security-reviewer` | Security analysis and vulnerability detection |
| `tiny-brain:performance-engineer` | Performance optimization and analysis |
| `tiny-brain:quality-coordinator` | Orchestrates quality analysis across categories |

### MCP Tools

- **Persona Management** - Switch contexts, manage personas, sync with cloud
- **Repository Analysis** - Detect tech stack, recommend agents
- **Planning Tools** - PRD creation, feature management, progress tracking
- **Quality Tools** - Save and retrieve quality analysis results
- **Rules Management** - Configure golden rules across personas

### Hooks

- **TDD Enforcement** - Validates commit messages follow TDD phases (test/feat/refactor)
- **Pre-commit Checks** - Runs typecheck, lint, and tests based on commit type

### Dashboard

Real-time visualization of:
- PRD progress and feature status
- Fix tracking and task completion
- Quality analysis trends
- Agent and skill inventory

## Quick Start

1. **Analyze your repository**
   ```
   /analyse
   ```
   Detects your tech stack and recommends agents to install.

2. **Create a PRD**
   ```
   /plan
   ```
   Interactively plan a new feature or product.

3. **Run quality analysis**
   ```
   /quality
   ```
   Comprehensive code quality check across 8 categories.

## TDD Workflow

Tiny Brain enforces Test-Driven Development through commit tracking:

| Phase | Commit Prefix | Description |
|-------|---------------|-------------|
| Red | `test:` | Write failing tests first |
| Green | `feat:` | Implement to pass tests |
| Refactor | `refactor:` | Clean up without changing behavior |

Progress is automatically tracked in `.tiny-brain/progress/` files.

## Configuration

### Preferences

```bash
# Enable auto-commit for progress tracking
npx tiny-brain config preferences set autoCommitProgress true

# Check current preferences
npx tiny-brain config preferences list
```

### Managing the Plugin

```bash
# Update to latest version
/plugin update tiny-brain@tiny-brain-marketplace

# List installed plugins
/plugin list

# Remove plugin
/plugin uninstall tiny-brain
```

## Pro Features (Coming Soon)

- Cloud sync for personas, agents, and skills
- Quality trend analysis and regression alerts
- Team collaboration features
- Cross-machine history

## Documentation

Visit [github.com/magic-ingredients/tiny-brain-local](https://github.com/magic-ingredients/tiny-brain-local) for full documentation.

## License

MIT
