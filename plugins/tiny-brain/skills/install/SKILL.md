---
name: install
version: 2.0.0
description: Install a review capability by reading its capability markdown and executing the install instructions. Usage: /install <capability-id>
allowed-tools: Read, Write, Bash, Glob, Grep
---

# Install Capability Skill

## When to Use

Install a review capability when the user runs `/install <capability-id>`. The capability ID corresponds to a markdown file in the plugin's `capabilities/` directory.

## Capability Discovery

Do NOT use a hardcoded list. Discover available capabilities dynamically:

1. Read all `*.md` files from `${CLAUDE_PLUGIN_ROOT}/capabilities/` (or `capabilities/` relative to working directory)
2. Extract `id` and `name` from each file's YAML frontmatter
3. Match the user's requested capability ID against discovered capabilities

If the requested ID is not found, list all discovered capabilities:
> Capability '<id>' not found. Available capabilities:
> - mutation-testing (Mutation Testing)
> - security-review (Security Review)
> - ...

## Workflow

### Step 1: Find the Capability File

Look for the capability markdown file. Search in order:

1. `${CLAUDE_PLUGIN_ROOT}/capabilities/<capability-id>.md` (plugin directory)
2. `capabilities/<capability-id>.md` (relative to working directory)

### Step 2: Read the Capability File

Read the capability markdown and extract:
- **Frontmatter**: id, name, emoji, category, version, agent
- **Install section**: The instructions to execute (may be absent for built-in capabilities)
- **Detect section**: How to check if already installed

### Step 3: Check if Already Installed

Before installing, check the Detect section conditions:
- If "Built-in capability" → already installed, skip to confirmation
- If the capability lists package checks (e.g., `@stryker-mutator/core` in devDependencies), read `package.json` and check
- If the capability lists file checks (e.g., `stryker.config.mjs` exists), check for the file

If already installed, tell the user:
> <name> is already installed. Detection checks passed:
> - [check 1]: found
> - [check 2]: found

### Step 4: Execute Install Instructions

Follow the Install section step by step:
- Run bash commands as specified
- Read project files as instructed (to understand project structure)
- Create/write configuration files as described
- Adapt to the project's specific setup (monorepo vs single package, vitest vs jest, etc.)

Report progress as you go:
```
Installing <name>...
  [1/N] Installing packages...
  [2/N] Reading project configuration...
  ...
```

### Step 5: Verify Installation

After completing the install steps, run the Detect section checks again to verify everything was installed correctly.

### Step 6: Register Installation

After successful verification, register the capability as installed:

```bash
npx tiny-brain capability install <capability-id>
```

This atomically adds the ID to `.tiny-brain/capabilities/installed.json`, creating the file and directory if needed.

Report results:
```
<name> installed successfully!
  - @stryker-mutator/core: installed
  - stryker.config.mjs: created

The <agent> agent is now available in your review pipeline.
Refresh the dashboard to see it in the pipeline editor.
```

If any check fails:
```
<name> partially installed. Some checks failed:
  - @stryker-mutator/core: installed
  - stryker.config.mjs: NOT FOUND - you may need to create this manually
```

## Built-in Capabilities

For capabilities where the Detect section says "Built-in capability (always available when plugin is installed)":

1. No installation needed — the agent ships with the plugin
2. Tell the user the capability is ready to use
3. Suggest enabling it in the pipeline configuration via the dashboard

## Example

```
User: /install mutation-testing

Claude:
1. Discover: read capabilities/*.md → found 8 capabilities
2. Match: mutation-testing.md found
3. Read: extract Install + Detect sections
4. Check if @stryker-mutator/core is in devDependencies → not found
5. Execute install steps:
   - npm install --save-dev @stryker-mutator/core @stryker-mutator/vitest-runner
   - Read vitest.config.ts, package.json
   - Create stryker.config.mjs
   - Add test:mutate script
6. Verify: all detect checks pass
7. Report success
```
