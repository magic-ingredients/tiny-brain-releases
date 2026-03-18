# 🧠 tiny-brain

**Stop vibe coding. Start shipping.**

Your AI writes code fast. tiny-brain makes sure it actually works — tested, tracked, and ready to deploy.

## What it does

tiny-brain is a Claude Code plugin that makes your codebase AI-ready. It analyses your code, sets up guardrails, and gives AI agents the context they need to write code you'd actually approve in a PR.

## The problem

AI coding is fast. Until it isn't. You ship a feature in 20 minutes, then spend 2 hours fixing what it broke. No tests, no specs, no audit trail — just you cleaning up after AI.

## How tiny-brain fixes it

### Make your code AI-ready
One command analyses your codebase — languages, frameworks, test setup, project structure — and makes it all navigable for AI. Agents stop guessing and start working *with* your code.

```bash
npx tiny-brain analyse
```

### Every task has a pipeline
Every task flows through a full pipeline, visible in real time on your local dashboard.

**Per commit:** 🔴 Red → 🟢 Green → 😈 Adversarial review

**Per push:** 🧟 Mutation testing → 📦 Dependency analysis

### Full audit trail
Every task records its test SHA, implementation SHA, review verdict, and refactor SHA. You can trace any line of code back to the task that created it.

### Personas
AI that already knows your stack. No more re-explaining your conventions and preferences — personas load full context so you go straight to building.

### Quality scoring
Score your codebase across 8 categories. Know exactly where you stand before adding AI — because adding AI to a poor quality codebase just makes things worse.

## Get started

```
# In Claude Code
/plugin marketplace add https://github.com/magic-ingredients/tiny-brain-releases

/plugin install tiny-brain@tiny-brain-marketplace

# In your terminal
npx tiny-brain analyse

# Back in Claude Code
as developer
/plan "add user authentication"
```

Dashboard available at `localhost:8765`

## What's included

- 8 specialized agents
- 5 built-in skills (`/plan`, `/feature`, `/fix`, `/adr`, `/quality`)
- Local dashboard with real-time progress tracking
- Personas (local + git-based sharing)
- Git hooks + TDD enforcement
- Quality scoring across 8 categories
- 100% local — no data leaves your machine

## Security & privacy

- **100% local** — all data stored on your machine
- **No accounts, no telemetry** — install and go
- **Open source** — inspect everything
- **Uninstall anytime** — no lock-in

## Links

- [Website](https://tiny-brain.com)
- [Issues](https://github.com/magic-ingredients/tiny-brain-releases/issues)

---

Built by [magic ingredients](https://tiny-brain.com). Free and open source.
