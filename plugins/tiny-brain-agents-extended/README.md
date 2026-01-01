# Tiny Brain Extended Agents

Extended agents for specialized development workflows. Requires the core `tiny-brain` plugin.

## Agents Included

| Agent | Model | Description |
|-------|-------|-------------|
| `architect` | opus | System design and architecture specialist |
| `tdd-validator` | haiku | TDD compliance validator and enforcement |
| `security-reviewer` | opus | Security analysis and vulnerability detection |

## Installation

```bash
# First, install the core tiny-brain plugin
claude plugin install tiny-brain

# Then install extended agents
claude plugin install tiny-brain-agents-extended
```

## Usage

Extended agents are automatically available after installation:

```
# Use the architect agent for system design
"Use the architect agent to design the authentication system"

# Use tdd-validator to check TDD compliance
"Use tdd-validator to review my recent commits"

# Use security-reviewer for security analysis
"Use security-reviewer to audit the API endpoints"
```

## Agent Details

### Architect (`opus`)
- System design and architecture decisions
- Creates Architecture Decision Records (ADRs)
- Evaluates trade-offs and alternatives
- Best for: Major technical decisions, system redesigns

### TDD Validator (`haiku`)
- Validates test-first development practices
- Analyzes commit history for TDD compliance
- Reports violations and suggests corrections
- Best for: Enforcing TDD discipline, code review

### Security Reviewer (`opus`)
- Security vulnerability analysis
- OWASP Top 10 checks
- Authentication/authorization review
- Best for: Security audits, pre-deployment checks

## Requirements

- Claude Code CLI
- `tiny-brain` plugin (core)

## License

MIT
