#!/bin/sh
#
# agent-lease-renew.sh — Codex PreToolUse hook (the lease heartbeat)
# (interactive-agent-provenance F8)
#
# Fires immediately before each tool call. Renews this session's lease (bumping
# its TTL so an active session never expires). Codex's PreToolUse payload carries
# both session_id and model, so the heartbeat also refreshes model — but Codex
# exposes no effort field anywhere, so effort is never set. Codex has no
# SessionEnd event, so there is no clear hook: an abandoned lease expires on its
# own via the TTL.
#
# Best-effort and SILENT: no stdout, all CLI output to /dev/null, always exit 0,
# so a lease hiccup can never stall a tool call.

input=$(cat)

command -v jq >/dev/null 2>&1 || exit 0

session_id=$(printf '%s' "$input" | jq -r '.session_id // empty' 2>/dev/null)
model=$(printf '%s' "$input" | jq -r '.model // empty' 2>/dev/null)

[ -n "$session_id" ] || exit 0

if [ -n "$model" ]; then
  tiny-brain _agent-lease renew --session-id "$session_id" --model "$model" >/dev/null 2>&1 || true
else
  tiny-brain _agent-lease renew --session-id "$session_id" >/dev/null 2>&1 || true
fi

exit 0
