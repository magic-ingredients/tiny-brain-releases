# Git Hook Templates

These hooks are installed automatically by `tiny-brain analyse` or manually via `tiny-brain hooks install`.

## Hooks

### pre-commit
Runs before each commit:
- TypeScript type checking
- ESLint linting
- Tests (skipped for `test:` commits - TDD red phase)

### commit-msg
Validates commit message format:
- Must use conventional commit format
- Required prefix: `test:`, `feat:`, `refactor:`, `fix:`, `chore:`, `untracked:`, etc.
- Allows merge and revert commits

### post-commit
Tracks commits for PRD progress:
- Detects PRD/Feature/Task headers in commit messages
- Updates progress.json automatically
- Silent if no tracking headers present

## TDD Workflow

| Phase | Commit Prefix | Tests | Tracked Field |
|-------|--------------|-------|---------------|
| RED | `test:` | Skip (should fail) | `testCommitSha` |
| GREEN | `feat:` or `fix:` | Must pass | `commitSha` |
| REFACTOR | `refactor:` | Must pass | `refactorCommitSha` |

## Installation

Automatic (recommended):
```bash
npx tiny-brain analyse
```

Manual:
```bash
npx tiny-brain hooks install
```

## Uninstallation

```bash
npx tiny-brain hooks uninstall
```

## Customization

After installation, hooks are in `.git/hooks/`. You can edit them directly, but changes will be overwritten on next `analyse` or `hooks install`.

To preserve customizations:
1. Edit the hooks in `.git/hooks/`
2. Add `.git/hooks/*` to your backup/notes

Or fork the templates in your project.
# test
