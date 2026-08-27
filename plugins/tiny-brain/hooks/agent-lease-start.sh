#!/bin/bash
#
# agent-lease-start.sh — Claude Code SessionStart hook
# (interactive-agent-provenance F8)
#
# Records this interactive session's identity as a worktree lease so the
# commit-msg hook can stamp durable `Agent:` / `Agent-Model:` trailers. Reads the
# SessionStart hook JSON on stdin for `session_id` (stable for the session's life)
# and the optional `model`, then calls the hidden `_agent-lease start`.
#
# Best-effort and SILENT: it must never disturb the session. It writes NOTHING to
# stdout (a SessionStart hook's stdout is parsed as additionalContext JSON), sends
# all CLI output to /dev/null, and always exits 0. A session outside a git repo,
# or with no CLI, simply records no lease — provenance falls back to neutral.

# Resolve the package-manager exec prefix ($EXEC); tolerate a resolver failure.
. "$(dirname "$0")/resolve-exec.sh" 2>/dev/null || true

input=$(cat)

# jq is a hard dependency of the plugin hooks; if it is somehow absent, skip
# rather than error out.
command -v jq >/dev/null 2>&1 || exit 0

session_id=$(printf '%s' "$input" | jq -r '.session_id // empty' 2>/dev/null)
model=$(printf '%s' "$input" | jq -r '.model // empty' 2>/dev/null)

# session_id is the anchor — without it there is nothing stable to attribute.
[ -n "$session_id" ] || exit 0

if [ -n "$model" ]; then
  $EXEC tiny-brain _agent-lease start --agent claude-code --session-id "$session_id" --model "$model" >/dev/null 2>&1 || true
else
  $EXEC tiny-brain _agent-lease start --agent claude-code --session-id "$session_id" >/dev/null 2>&1 || true
fi

exit 0
