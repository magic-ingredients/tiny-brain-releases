#!/bin/sh
#
# Lifecycle-driven prune trigger — invoked from the pre-push git hook.
#
# Reads `preferences.repo.prune.onPush` and `preferences.repo.prune.onPr`
# from the merged tiny-brain config. Each is independent:
#
#   - onPush=true  → run `tiny-brain prune --trigger push --quiet`
#   - onPr=true    → if `gh pr view` reports a PR exists, run
#                    `tiny-brain prune --trigger pr --quiet` instead.
#                    If `gh` is missing, log a debug line and skip.
#
# This script must NEVER block a push. Any error is swallowed and the
# script exits 0.
#
# Installed by: tiny-brain hooks install
#

# Resolve package manager exec command (same convention as pre-push).
HOOKS_DIR=$(cd "$(dirname "$0")" && pwd)
EXEC=$("$HOOKS_DIR/tiny-brain-exec" 2>/dev/null || echo "npx")

EXEC_CMD=$(echo "$EXEC" | cut -d' ' -f1)
if ! command -v "$EXEC_CMD" >/dev/null 2>&1; then
  # Without the package-manager runner there's no way to call the CLI.
  # Skip silently — the user's push is more important than the sweep.
  exit 0
fi

# Read a flat preference key. Output is `<key>: <value>`; we want the
# value from the first line. `NR==1{print; exit}` does that in a single
# awk invocation (no `head -1` pipeline).
read_pref() {
  $EXEC tiny-brain config preferences get "$1" 2>/dev/null \
    | awk -F': ' 'NR==1{print $2; exit}'
}

ON_PUSH=$(read_pref pruneOnPush)
ON_PR=$(read_pref pruneOnPr)

# Decide which trigger to fire. Push and PR are independent — but PR is
# the "narrower" trigger (an open PR is a stronger signal that work is
# going public), so it wins when both are set and a PR exists.
TRIGGER=""

if [ "$ON_PR" = "true" ]; then
  if command -v gh >/dev/null 2>&1; then
    # `gh pr view` returns the PR associated with the branch in ANY
    # state (OPEN/CLOSED/MERGED). Restrict to OPEN — that's the
    # "going public" boundary the spec calls out. Match the literal
    # `"state":"OPEN"` payload to avoid false positives on the other
    # states, which would prune on every push to merged branches.
    if gh pr view --json state 2>/dev/null | grep -q '"state":"OPEN"'; then
      TRIGGER="pr"
    fi
  else
    # No `gh` on PATH. Log to stderr at debug level so users can
    # diagnose without it being a hard error. Don't block the push.
    [ -n "$TINY_BRAIN_DEBUG" ] && echo "[prune-on-push] gh not on PATH — onPr trigger skipped" >&2
  fi
fi

if [ -z "$TRIGGER" ] && [ "$ON_PUSH" = "true" ]; then
  TRIGGER="push"
fi

if [ -z "$TRIGGER" ]; then
  exit 0
fi

# Fire the prune. Errors are logged to stderr but never block the push.
if ! $EXEC tiny-brain prune --trigger "$TRIGGER" --quiet >/dev/null 2>&1; then
  echo "[prune-on-push] prune --trigger $TRIGGER failed (non-blocking)" >&2
fi

exit 0
