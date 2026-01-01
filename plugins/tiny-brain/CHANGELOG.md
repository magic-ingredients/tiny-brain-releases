# @magic-ingredients/tiny-brain-plugin

## 0.14.2

### Patch Changes

- df25e3d: Fix release script to sync all version files (DXT, plugin.json)

## 0.14.1

### Patch Changes

- Fix high severity security vulnerabilities in dependencies

## 0.14.0

### Minor Changes

- ## Plugin bundled assets and dashboard integration

  - Add bundled dashboard and server assets to plugin package
  - Add plugin discovery routes and service to dashboard
  - Add .claude/ directories to gitignore
  - Complete Features 0-6 of Claude Code Plugin PRD (44% overall)

  ### Plugin Features Completed:

  - Monorepo restructure with core/cli/mcp/dashboard/plugin packages
  - Plugin core structure with manifest and directories
  - Free tier skills (plan, feature, fix, adr)
  - Marketplace agent integration (developer, planner, reviewer, architect, tdd-validator)
  - Free tier Claude hooks (TDD enforcement, dev enhancements)
  - Pro Git hooks via analyse
