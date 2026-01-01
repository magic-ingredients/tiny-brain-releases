# Claude Code Hooks

This directory contains hooks that enhance Claude Code with TDD enforcement and development quality checks.

## Overview

| Hook | Trigger | Purpose |
|------|---------|---------|
| `tdd-validate.sh` | PreToolUse (Write/Edit) | Blocks writes without failing tests |
| ESLint auto-fix | PostToolUse (Write/Edit) | Auto-formats code after writes |
| TypeScript check | PostToolUse (Write/Edit) | Reports type errors after writes |
| Git status | Stop | Shows uncommitted changes on exit |

## TDD Guard

The TDD Guard enforces test-driven development by blocking file writes until failing tests exist.

### How It Works

1. **Run tests** with a TDD Guard reporter to capture results
2. **Write tests first** - they should fail (this is the Red phase)
3. **Write implementation** - now allowed because failing tests exist
4. **Tests pass** - the Green phase is complete

### Setup

#### 1. Configure Test Reporter

**Vitest:**
```typescript
// vitest.config.ts
import { tddGuardReporter } from 'tiny-brain-plugin/hooks/reporters/vitest-reporter';

export default defineConfig({
  test: {
    reporters: ['default', tddGuardReporter()]
  }
});
```

**Jest:**
```javascript
// jest.config.js
module.exports = {
  reporters: [
    'default',
    'tiny-brain-plugin/hooks/reporters/jest-reporter'
  ]
};
```

**Pytest:**
```bash
pytest --tdd-guard
```

Or in `conftest.py`:
```python
pytest_plugins = ['tiny_brain_plugin.hooks.reporters.pytest_reporter']
```

#### 2. Run Tests

```bash
npm test        # or your test command
npx vitest      # vitest with reporter
npx jest        # jest with reporter
pytest --tdd-guard
```

Test results are written to `.claude/tdd-guard/data/test.json`.

### Workflow

```
┌─────────────────┐
│   Write Test    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────────────┐
│   Run Tests     │────▶│ Results → test.json      │
└────────┬────────┘     │ (failed > 0)             │
         │              └──────────────────────────┘
         ▼
┌─────────────────┐
│ Write/Edit Code │  ◀── Allowed (failing tests exist)
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────────────┐
│   Run Tests     │────▶│ Results → test.json      │
└────────┬────────┘     │ (failed = 0)             │
         │              └──────────────────────────┘
         ▼
┌─────────────────┐
│ Write/Edit Code │  ◀── BLOCKED (no failing tests)
└─────────────────┘
```

### Toggle TDD Guard

Temporarily disable TDD enforcement:

```bash
# Check status
./hooks/tdd-toggle.sh

# Disable
./hooks/tdd-toggle.sh off

# Re-enable
./hooks/tdd-toggle.sh on
```

### Result File Format

`.claude/tdd-guard/data/test.json`:
```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "passed": 42,
  "failed": 2,
  "skipped": 1,
  "total": 45,
  "duration": 1234,
  "failedTests": [
    {
      "name": "should handle user authentication",
      "file": "src/auth.test.ts",
      "error": "Expected true but got false"
    }
  ]
}
```

### Stale Results

Test results older than 5 minutes are considered stale. The hook will warn but allow writes. Run tests again to get fresh results.

## Development Enhancement Hooks

### PostToolUse Hooks

After each Write/Edit operation:

1. **ESLint Auto-fix**: Automatically formats code
   - Runs `npx eslint --fix` on the modified file
   - Silently continues if ESLint is not configured

2. **TypeScript Check**: Reports type errors
   - Runs `npx tsc --noEmit`
   - Shows first 5 errors if any exist

### Stop Hook

When Claude Code exits:
- Shows `git status --short` (first 10 files)
- Helps you see uncommitted changes

## Configuration

The hooks are configured in `hooks.json`:

```json
{
  "$schema": "https://claude.ai/hooks-schema/v1",
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "Stop": [...]
  }
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `CLAUDE_PLUGIN_ROOT` | Plugin installation directory |
| `CLAUDE_FILE_PATH` | Path of file being written/edited |

## Troubleshooting

### "No test results found"

Run your tests with the appropriate reporter to generate `test.json`:
```bash
npm test  # with reporter configured
```

### "Test results are stale"

Your test results are older than 5 minutes. Run tests again:
```bash
npm test
```

### Hook is blocking legitimate writes

Temporarily disable TDD guard:
```bash
./hooks/tdd-toggle.sh off
# ... do your work ...
./hooks/tdd-toggle.sh on
```

### ESLint errors after write

The PostToolUse ESLint hook auto-fixes what it can. For remaining issues, fix them manually or adjust your ESLint config.
