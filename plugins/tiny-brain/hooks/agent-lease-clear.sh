#!/bin/bash
#
# agent-lease-clear.sh — Claude Code SessionEnd hook
# (interactive-agent-provenance F8)
#
# Releases this session's lease when the session ends. The store clears only when
# the ending session OWNS the lease, so a newer session that has since taken over
# the worktree is never wiped. This is an optimisation, not a correctness
# requirement — an unreleased lease expires on its own via the TTL — so, like the
# other lease hooks, it is silent (no stdout, CLI output to /dev/null) and always
# exits 0.

. "$(dirname "$0")/resolve-exec.sh" 2>/dev/null || true

input=$(cat)

command -v jq >/dev/null 2>&1 || exit 0

session_id=$(printf '%s' "$input" | jq -r '.session_id // empty' 2>/dev/null)

[ -n "$session_id" ] || exit 0

$EXEC tiny-brain _agent-lease clear --session-id "$session_id" >/dev/null 2>&1 || true

exit 0
