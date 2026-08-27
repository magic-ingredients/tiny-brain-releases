#!/bin/bash
#
# agent-lease-renew.sh — Claude Code PreToolUse hook (the lease heartbeat)
# (interactive-agent-provenance F8)
#
# Fires immediately before each tool call. Renews this session's lease (bumping
# its TTL so an active session never expires) and refreshes the effort from the
# PreToolUse payload's `effort.level` — Claude Code surfaces effort ONLY here, not
# at SessionStart, so the heartbeat is where the latest effort is captured. The
# lease's model is preserved (PreToolUse carries no model).
#
# CRITICAL: this is a PreToolUse hook, where a non-zero exit (2) BLOCKS the tool
# call. It must therefore be inert — NOTHING to stdout, all CLI output to
# /dev/null, and ALWAYS `exit 0`, so a lease hiccup can never stall the session.

. "$(dirname "$0")/resolve-exec.sh" 2>/dev/null || true

input=$(cat)

command -v jq >/dev/null 2>&1 || exit 0

session_id=$(printf '%s' "$input" | jq -r '.session_id // empty' 2>/dev/null)
effort=$(printf '%s' "$input" | jq -r '.effort.level // empty' 2>/dev/null)

[ -n "$session_id" ] || exit 0

if [ -n "$effort" ]; then
  $EXEC tiny-brain _agent-lease renew --session-id "$session_id" --effort "$effort" >/dev/null 2>&1 || true
else
  $EXEC tiny-brain _agent-lease renew --session-id "$session_id" >/dev/null 2>&1 || true
fi

exit 0
