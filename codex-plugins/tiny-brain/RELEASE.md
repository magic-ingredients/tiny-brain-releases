# Tiny Brain Codex distribution

The assembled release target is `dist-codex-marketplace/`. Its marketplace
source is `.agents/plugins/marketplace.json`, and it exposes the plugin as
`tiny-brain@tiny-brain-marketplace`.

The marketplace source resolves from `codex-plugins/tiny-brain`; remote
marketplace registration therefore sparse-checks out both `.agents/plugins`
and `codex-plugins`.

The plugin starts the already-installed Tiny Brain CLI with `tiny-brain mcp`.
Run `tiny-brain configure --codex` after installing the CLI to register and
install this distribution.
