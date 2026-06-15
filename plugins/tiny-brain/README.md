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

### Skills (6)

| Skill | Command | Description |
|-------|---------|-------------|
| Plan | `/plan` | Create Product Requirements Documents with features and tasks |
| Feature | `/feature` | Add features to an existing PRD |
| Fix | `/fix` | Document and track bug fixes with TDD workflow |
| ADR | `/adr` | Create Architecture Decision Records |
| Quality | `/quality` | Run comprehensive code quality analysis |
| Install | `/install` | Install a review capability into the repo's pipeline |

### Agents (10)

Wired into the default review pipeline:

| Agent | Description |
|-------|-------------|
| `tiny-brain:adversarial-reviewer` | Critically reviews TDD red/green work from an isolated context |
| `tiny-brain:analyzer-agent` | Runs static analysers and reports pass/fail against thresholds |
| `tiny-brain:code-quality-reviewer` | Code quality, maintainability, architecture, documentation |
| `tiny-brain:performance-reviewer` | Performance bottlenecks, N+1, memory leaks, optimisation |
| `tiny-brain:security-reviewer` | OWASP Top 10, injection, auth, data exposure |
| `tiny-brain:tdd-compliance-reviewer` | TDD compliance: test-first, coverage, red-green-refactor discipline |
| `tiny-brain:testing-reviewer` | Assertion quality, flaky tests, mock discipline, test strategy |

Used by the `/quality` skill (orchestrates the others):

| Agent | Description |
|-------|-------------|
| `tiny-brain:quality-coordinator` | Orchestrates quality analysis, aggregates findings, computes scores |

Available to add to your pipeline (not enabled by default — wire in via the dashboard SetupTab):

| Agent | Description |
|-------|-------------|
| `tiny-brain:dependency-audit-reviewer` | Runs the project's audit tool, reports vulnerabilities + remediation |
| `tiny-brain:mutation-reviewer` | Mutation testing via Stryker; reports surviving mutants and test gaps |

### MCP Tools

- **Persona Management** - Switch contexts, manage personas, sync with cloud
- **Repository Analysis** - Detect tech stack, recommend agents
- **Planning Tools** - PRD creation, feature management, progress tracking
- **Quality Tools** - Save and retrieve quality analysis results
- **Rules Management** - Configure golden rules across personas

> Listing PRDs and fixes by status is the `tiny-brain work` CLI subcommand (cross-provider). Answers "in-prog fixes", "list all open PRDs", "what have I got in progress" with the same flag set documented in AGENTS.md "Listing work".

### Hooks

- **TDD Enforcement** - Validates commit messages follow TDD phases (test/feat/refactor)
- **Pre-commit Checks** - Runs typecheck, lint, and tests based on commit type

### Dashboard

Real-time visualization of:
- PRD progress and feature status
- Fix tracking and task completion
- Quality analysis trends
- Agent and skill inventory
- Starred repos surfaced under the Repos sidebar item for one-click access

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
# Check current preferences
tiny-brain config preferences list
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
