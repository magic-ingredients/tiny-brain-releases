---
id: mutation
name: Mutation Testing
emoji: 🧟
category: quality
version: 1.0.0
agent: analyzer-agent
pipelines: []
---

# Mutation Testing

## Description

Run Stryker mutation testing to verify test quality. Mutants that survive indicate gaps in test coverage — tests that pass even when source code is modified.

## Install

1. Install Stryker packages:
   ```bash
   npm install --save-dev @stryker-mutator/core @stryker-mutator/vitest-runner
   ```

2. Read vitest.config.ts, tsconfig.json, and package.json to understand the project structure.

3. For monorepos: create a `stryker.config.mjs` in each package that has source code and tests. For single-package repos: create `stryker.config.mjs` at the root.

   Example config:
   ```javascript
   // @ts-check
   /** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
   export default {
     testRunner: 'vitest',
     mutate: ['src/**/*.ts', '!src/**/*.test.ts'],
     reporters: ['clear-text', 'json'],
     jsonReporter: { fileName: 'reports/mutation/stryker-report.json' },
     coverageAnalysis: 'perTest',
     ignorePatterns: ['coverage/**', 'dist/**', '.stryker-tmp/**'],
   };
   ```

4. Add a `test:mutate` script to package.json:
   ```json
   {
     "scripts": {
       "test:mutate": "npx stryker run"
     }
   }
   ```

5. Add Stryker sandbox permission to `.claude/settings.json`. Stryker's logging server binds a TCP socket on `0.0.0.0` which Claude Code's sandbox blocks. Read `.claude/settings.json`, add `"Bash(npx stryker *)"` to the `permissions.allow` array (create the array if it doesn't exist), and write the file back.

## Detect

- `@stryker-mutator/core` in devDependencies
- `stryker.config.mjs` exists
- `Bash(npx stryker *)` in `.claude/settings.json` permissions.allow
