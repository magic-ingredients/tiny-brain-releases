#!/bin/sh
# tiny-brain curl installer (install-dx F3 curl-door).
#
#   curl -fsSL <raw-url> | sh
#
# Deliberately thin: preflight Node >= 18, then install the CLI globally with
# npm and verify the binary that lands.
#
# This door used to delegate to a `npx … install` engine so install logic lived
# in one place. That engine (and the `tiny-brain install` command fronting it)
# was retired with the legacy setup entrypoints, leaving this script calling a
# command that no longer exists — fix
# install-doors-call-retired-install-command. The install is now the plain npm
# global install every other door also performs, and configuration is a
# separate step the user runs afterwards (`tiny-brain configure`).

set -u

MIN_NODE_MAJOR=18
PKG="@magic-ingredients/tiny-brain"
configure_requested=false
configure_yes=false
configure_clients=""

err() {
  printf '%s\n' "$*" >&2
}

# TB_INSTALL_TEST_TTY=1 forces the interactive branch. It exists ONLY so the
# test suite can exercise first-run configuration without allocating a pty
# (install.test.js) — a real `curl … | sh` is never a tty, so the branch would
# otherwise be unreachable under test. It is deliberately not documented as a
# user-facing switch.
is_interactive_terminal() {
  [ "${TB_INSTALL_TEST_TTY:-}" = "1" ] || { [ -t 0 ] && [ -t 1 ]; }
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --configure) configure_requested=true ;;
    --yes) configure_yes=true ;;
    --clients)
      shift
      if [ "$#" -eq 0 ]; then err "--clients requires a comma-separated value"; exit 1; fi
      configure_clients="$1"
      ;;
    *) err "Usage: install.sh [--configure --yes [--clients claude-code,codex]]"; exit 1 ;;
  esac
  shift
done
if [ "$configure_requested" = true ] && [ "$configure_yes" != true ]; then
  err "--configure requires --yes in a noninteractive installer."
  exit 1
fi
if [ "$configure_requested" != true ] && { [ "$configure_yes" = true ] || [ -n "$configure_clients" ]; }; then
  err "--yes and --clients require --configure."
  exit 1
fi

after_cli_install() {
  verified_binary="$1"
  path_repair="$2"
  requested_configuration="$3"
  selected_clients="$4"
  printf 'tiny-brain installed: %s\n' "$verified_binary"
  if [ -n "$path_repair" ]; then printf 'PATH repair: %s\n' "$path_repair"; fi
  if [ "$requested_configuration" = true ]; then
    if [ -n "$selected_clients" ]; then
      "$verified_binary" configure --yes --clients "$selected_clients"
    else
      "$verified_binary" configure --yes
    fi
    return $?
  elif is_interactive_terminal; then
    if ! "$verified_binary" configure --first-run; then
      printf 'First-run configuration could not start. Run: tiny-brain configure --first-run\n'
    fi
  else
    printf 'Next: run tiny-brain configure --first-run\n'
  fi
}

if ! command -v node >/dev/null 2>&1; then
  err "tiny-brain needs Node.js >= ${MIN_NODE_MAJOR}, but 'node' was not found."
  err "Install Node from https://nodejs.org/ (or via nvm) and re-run this installer."
  exit 1
fi

# Parse the major version with POSIX parameter expansion (no sed/awk) so the
# script has no dependency beyond node/npx and the shell itself.
NODE_VERSION=$(node --version 2>/dev/null)   # e.g. v20.11.0
node_major=${NODE_VERSION#v}                 # strip leading 'v' -> 20.11.0
node_major=${node_major%%.*}                 # take major          -> 20

case "$node_major" in
  '' | *[!0-9]*)
    err "Could not determine the Node.js version (got '${NODE_VERSION}')."
    err "Install Node >= ${MIN_NODE_MAJOR} from https://nodejs.org/ and re-run this installer."
    exit 1
    ;;
esac

if [ "$node_major" -lt "$MIN_NODE_MAJOR" ]; then
  err "tiny-brain needs Node.js >= ${MIN_NODE_MAJOR}, but ${NODE_VERSION} is installed."
  err "Upgrade Node from https://nodejs.org/ (or via nvm) and re-run this installer."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  err "tiny-brain needs npm (bundled with Node.js), but 'npm' was not found."
  err "Reinstall Node/npm from https://nodejs.org/ and re-run this installer."
  exit 1
fi

# Install the CLI globally. Only a successful install may cross the stable
# post-install boundary below; this door never configures an agent client —
# `tiny-brain configure` does, and `after_cli_install` hands off to it.
npm install -g "$PKG"
install_status=$?
if [ "$install_status" -ne 0 ]; then exit "$install_status"; fi

global_prefix="$(npm prefix -g 2>/dev/null)" || global_prefix=""
if [ -n "$global_prefix" ]; then global_bin="$global_prefix/bin"; else global_bin=""; fi
if [ -n "$global_bin" ] && [ -x "$global_bin/tiny-brain" ]; then
  verified_binary="$global_bin/tiny-brain"
elif verified_binary="$(command -v tiny-brain 2>/dev/null)"; then
  :
else
  err "npm install -g $PKG completed but no verified CLI binary was found."
  exit 1
fi
# Derive the repair line from the directory of the binary we actually verified,
# NOT from the npm prefix. Deriving it from `global_bin` let the two diverge: a
# CLI verified via `command -v` somewhere else would still be advertised with a
# repair line naming the npm prefix, telling the user to prepend a directory
# that does not contain the binary (adversarial review, HIGH).
#
# Parameter expansion rather than `dirname`: this script runs before anything is
# guaranteed on PATH beyond node/npm, so it must not depend on coreutils.
case "$verified_binary" in
  */*) verified_dir="${verified_binary%/*}" ;;
  *) verified_dir="" ;;
esac
if [ -z "$verified_dir" ]; then
  # A bare name with no directory part — nothing meaningful to prepend.
  path_repair=""
else
  case ":$PATH:" in
    *":$verified_dir:"*) path_repair="" ;;
    *) path_repair="export PATH=\"$verified_dir:\$PATH\"" ;;
  esac
fi
after_cli_install "$verified_binary" "$path_repair" "$configure_requested" "$configure_clients"
