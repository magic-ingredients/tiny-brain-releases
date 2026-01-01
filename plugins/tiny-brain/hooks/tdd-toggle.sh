#!/bin/bash
#
# TDD Guard Toggle Script
# Enable or disable TDD enforcement
#
# Usage:
#   ./tdd-toggle.sh on    # Enable TDD enforcement
#   ./tdd-toggle.sh off   # Disable TDD enforcement
#   ./tdd-toggle.sh       # Show current status
#

set -e

TDD_GUARD_DIR=".claude/tdd-guard"
CONFIG_FILE="$TDD_GUARD_DIR/config.json"

# Ensure directory exists
mkdir -p "$TDD_GUARD_DIR"

# Get current status
get_status() {
  if [ -f "$CONFIG_FILE" ]; then
    ENABLED=$(cat "$CONFIG_FILE" 2>/dev/null | grep -o '"enabled":\s*\(true\|false\)' | grep -o '\(true\|false\)' || echo "true")
  else
    ENABLED="true"
  fi
  echo "$ENABLED"
}

# Show status
show_status() {
  STATUS=$(get_status)
  if [ "$STATUS" = "true" ]; then
    echo "🔒 TDD Guard: ENABLED"
    echo "   Writes/Edits blocked until failing tests exist"
    echo ""
    echo "   To disable: $0 off"
  else
    echo "🔓 TDD Guard: DISABLED"
    echo "   Writes/Edits allowed without failing tests"
    echo ""
    echo "   To enable: $0 on"
  fi
}

# Enable TDD enforcement
enable_tdd() {
  cat > "$CONFIG_FILE" << 'EOF'
{
  "enabled": true,
  "updatedAt": "TIMESTAMP"
}
EOF
  sed -i.bak "s/TIMESTAMP/$(date -u +"%Y-%m-%dT%H:%M:%SZ")/" "$CONFIG_FILE" && rm -f "$CONFIG_FILE.bak"
  echo "🔒 TDD Guard: ENABLED"
  echo "   Writes/Edits blocked until failing tests exist"
  echo ""
  echo "   Run tests to capture failures before writing implementation code."
}

# Disable TDD enforcement
disable_tdd() {
  cat > "$CONFIG_FILE" << 'EOF'
{
  "enabled": false,
  "updatedAt": "TIMESTAMP"
}
EOF
  sed -i.bak "s/TIMESTAMP/$(date -u +"%Y-%m-%dT%H:%M:%SZ")/" "$CONFIG_FILE" && rm -f "$CONFIG_FILE.bak"
  echo "🔓 TDD Guard: DISABLED"
  echo "   Writes/Edits allowed without failing tests"
  echo ""
  echo "   ⚠️  Remember to re-enable TDD guard when done!"
  echo "   Run: $0 on"
}

# Main
case "${1:-}" in
  on|enable)
    enable_tdd
    ;;
  off|disable)
    disable_tdd
    ;;
  status|"")
    show_status
    ;;
  *)
    echo "Usage: $0 [on|off|status]"
    echo ""
    echo "Commands:"
    echo "  on, enable   - Enable TDD enforcement"
    echo "  off, disable - Disable TDD enforcement"
    echo "  status       - Show current status (default)"
    exit 1
    ;;
esac
