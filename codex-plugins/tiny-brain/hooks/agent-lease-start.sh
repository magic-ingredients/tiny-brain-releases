#!/bin/sh
#
# agent-lease-start.sh — Codex SessionStart hook
# (interactive-agent-provenance F8)
#
# Records this interactive Codex session's identity as a worktree lease so the
# commit-msg hook can stamp durable `Agent:` / `Agent-Model:` trailers. Codex
# delivers the SessionStart payload on stdin (session_id, model, source); we read
# session_id (stable for the session) and the optional model, then call the hidden
# `_agent-lease start`. Codex exposes no reasoning-effort in any hook payload
# (it lives only in config.toml), so effort is never captured here.
#
# Best-effort and SILENT: no stdout, all CLI output to /dev/null, always exit 0.
# A session outside a git repo, or with no `tiny-brain` on PATH, records no lease
# and provenance falls back to neutral.

input=$(cat)

command -v jq >/dev/null 2>&1 || exit 0

session_id=$(printf '%s' "$input" | jq -r '.session_id // empty' 2>/dev/null)
model=$(printf '%s' "$input" | jq -r '.model // empty' 2>/dev/null)

[ -n "$session_id" ] || exit 0

if [ -n "$model" ]; then
  tiny-brain _agent-lease start --agent codex --session-id "$session_id" --model "$model" >/dev/null 2>&1 || true
else
  tiny-brain _agent-lease start --agent codex --session-id "$session_id" >/dev/null 2>&1 || true
fi

exit 0
