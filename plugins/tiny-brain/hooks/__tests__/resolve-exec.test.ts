import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'node:fs';
import { execFileSync } from 'node:child_process';
import * as path from 'node:path';
import * as os from 'node:os';

/**
 * Behaviour tests for `resolve-exec.sh` — the plugin-hook variant of the
 * `tiny-brain-exec` resolver. Same contract as
 * `EXEC_HELPER_CONTENT` in tiny-brain-core but distributed differently
 * (sourced into plugin hook scripts via `. "$(dirname "$0")/resolve-exec.sh"`
 * instead of exec'd from .git/hooks/tiny-brain-exec).
 *
 * Tests source the script in a controlled PATH environment and echo
 * $EXEC. Path isolation matches the exec-helper-resolver.test.ts pattern.
 */
const RESOLVE_EXEC = path.resolve(__dirname, '..', 'resolve-exec.sh');

describe('plugin resolve-exec.sh', () => {
  let tmpDir: string;
  let repoDir: string;
  let pathWithoutTb: string;
  let pathWithTb: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'plugin-resolve-exec-'));

    repoDir = path.join(tmpDir, 'repo');
    await fs.mkdir(repoDir, { recursive: true });

    const noTbBin = path.join(tmpDir, 'noTb');
    await fs.mkdir(noTbBin, { recursive: true });
    // PM-fallback PATH: empty bin dir + /usr/bin:/bin for grep/tr/awk.
    // On hosts with /usr/bin/tiny-brain (apt/yum) the short-circuit
    // would silently fire and the fallback assertions would fail. The
    // precondition assertion below catches that environment.
    pathWithoutTb = `${noTbBin}:/usr/bin:/bin`;

    const withTbBin = path.join(tmpDir, 'withTb');
    await fs.mkdir(withTbBin, { recursive: true });
    const fakeTb = path.join(withTbBin, 'tiny-brain');
    await fs.writeFile(
      fakeTb,
      '#!/bin/sh\ncase "$1" in --version) echo "fake 0.0.0"; exit 0 ;; esac\nexit 0\n',
      'utf-8',
    );
    await fs.chmod(fakeTb, 0o755);
    pathWithTb = `${withTbBin}:/usr/bin:/bin`;
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  async function writeAnalysis(pm: string): Promise<void> {
    const analysisDir = path.join(repoDir, '.tiny-brain');
    await fs.mkdir(analysisDir, { recursive: true });
    await fs.writeFile(
      path.join(analysisDir, 'analysis.json'),
      JSON.stringify({ packageManager: pm }, null, 2),
      'utf-8',
    );
  }

  function sourceAndEcho(pathEnv: string, shell: 'sh' | 'bash' = 'sh'): string {
    // Source the script, then echo $EXEC. The script sets EXEC as an
    // unexported variable in the caller's shell — we have to be inside
    // the same shell instance to read it back. The optional `shell`
    // param lets us run via bash too, since real plugin hooks shebang
    // to bash and `return` semantics from sourced scripts can diverge
    // between sh / bash / dash.
    return execFileSync(
      shell,
      ['-c', `. ${JSON.stringify(RESOLVE_EXEC)} && printf '%s' "$EXEC"`],
      { cwd: repoDir, encoding: 'utf-8', env: { PATH: pathEnv } },
    );
  }

  function preconditionNoHostTb(pathEnv: string): void {
    // On Debian/Ubuntu, /usr/bin/tiny-brain can exist from a package
    // install and silently subvert the "fallback" branch's assertions.
    // Assert it isn't reachable so the test environment is provably
    // tb-free for the PM-fallback cases.
    let reachable = false;
    try {
      execFileSync('sh', ['-c', 'command -v tiny-brain'], {
        env: { PATH: pathEnv },
        stdio: 'pipe',
      });
      reachable = true;
    } catch {
      reachable = false;
    }
    if (reachable) {
      throw new Error(
        `Test host has tiny-brain reachable from PATH=${pathEnv}; fallback assertions cannot be trusted.`,
      );
    }
  }

  describe('when tiny-brain is on PATH (global short-circuit)', () => {
    it('sets EXEC to empty string when analysis.json says pnpm', async () => {
      await writeAnalysis('pnpm');
      expect(sourceAndEcho(pathWithTb)).toBe('');
    });

    it('sets EXEC to empty string when analysis.json is missing', () => {
      expect(sourceAndEcho(pathWithTb)).toBe('');
    });

    it('also short-circuits when sourced from bash (end-to-end across shell variants)', () => {
      // Real plugin hook scripts shebang to bash; the short-circuit's
      // `return 0` semantics must hold there too. Pins the contract
      // against a regression in either sh or bash sourcing behaviour.
      expect(sourceAndEcho(pathWithTb, 'bash')).toBe('');
    });

    it('falls through to PM when tiny-brain is found but `--version` fails (broken/dangling shim)', async () => {
      // Replace the fake with one that exits non-zero for --version,
      // mimicking a dangling dev-bin shim pointing at a missing
      // dist/cli.js or a half-built binary.
      const brokenTb = path.join(tmpDir, 'withTb', 'tiny-brain');
      await fs.writeFile(
        brokenTb,
        '#!/bin/sh\ncase "$1" in --version) exit 1 ;; esac\nexit 1\n',
        'utf-8',
      );
      await fs.chmod(brokenTb, 0o755);
      await writeAnalysis('pnpm');

      // command -v finds the binary but --version fails → fall through
      expect(sourceAndEcho(pathWithTb)).toBe('pnpm exec');
    });
  });

  describe('when tiny-brain is NOT on PATH (PM-wrapper fallback)', () => {
    it('sets EXEC to "pnpm exec" when analysis.json says pnpm', async () => {
      preconditionNoHostTb(pathWithoutTb);
      await writeAnalysis('pnpm');
      expect(sourceAndEcho(pathWithoutTb)).toBe('pnpm exec');
    });

    it('sets EXEC to "yarn exec" when analysis.json says yarn', async () => {
      preconditionNoHostTb(pathWithoutTb);
      await writeAnalysis('yarn');
      expect(sourceAndEcho(pathWithoutTb)).toBe('yarn exec');
    });

    it('sets EXEC to "bunx" when analysis.json says bun', async () => {
      preconditionNoHostTb(pathWithoutTb);
      await writeAnalysis('bun');
      expect(sourceAndEcho(pathWithoutTb)).toBe('bunx');
    });

    it('sets EXEC to "npx" when analysis.json says npm', async () => {
      preconditionNoHostTb(pathWithoutTb);
      await writeAnalysis('npm');
      expect(sourceAndEcho(pathWithoutTb)).toBe('npx');
    });

    it('sets EXEC to "npx" when analysis.json is missing', () => {
      preconditionNoHostTb(pathWithoutTb);
      expect(sourceAndEcho(pathWithoutTb)).toBe('npx');
    });

    it('does not leak _PM into the caller shell after the case statement', () => {
      preconditionNoHostTb(pathWithoutTb);
      // Source then probe — if _PM is leaked, this echoes its value;
      // the script should `unset _PM` after the case to keep callers clean.
      const leaked = execFileSync(
        'sh',
        ['-c', `. ${JSON.stringify(RESOLVE_EXEC)} && printf '%s' "${'$'}{_PM:-clean}"`],
        { cwd: repoDir, encoding: 'utf-8', env: { PATH: pathWithoutTb } },
      );
      expect(leaked).toBe('clean');
    });
  });

  describe('dev-mode gate (__TB_DEV_MODE)', () => {
    // These tests build a synthetic workspace layout that mimics the real
    // monorepo shape: packages/tiny-brain/dist/cli.js + packages/tiny-brain-plugin/
    // hooks/dev-bin/tiny-brain. resolve-exec.sh, when sourced with
    // __TB_DEV_MODE=1 and a CWD inside that fake workspace, must walk up to the
    // workspace root, prepend the workspace's hooks/dev-bin to PATH, and set
    // EXEC="" — so callers' existing `$EXEC tiny-brain …` invocation pattern
    // resolves to the workspace shim instead of whatever global tiny-brain the
    // host has installed. The synthetic CWD strategy decouples the test from
    // the real workspace's state (e.g. whether tiny-brain/dist/cli.js is
    // currently built).
    let devWorkspaceRoot: string;
    let devHooksDir: string;
    let devCliPath: string;
    let devBinDir: string;
    let devShimPath: string;

    beforeEach(async () => {
      // realpath here neutralises the macOS /var → /private/var symlink:
      // `pwd` inside the sourced script resolves through it, but
      // os.tmpdir() returns the unresolved form. Without realpath the
      // dev-bin path the gate prepends to PATH wouldn't string-match the
      // path we built the layout under, even though they reference the
      // same inode.
      devWorkspaceRoot = await fs.realpath(
        await fs.mkdtemp(path.join(os.tmpdir(), 'plugin-resolve-exec-dev-')),
      );
      const cliDistDir = path.join(devWorkspaceRoot, 'packages/tiny-brain/dist');
      devCliPath = path.join(cliDistDir, 'cli.js');
      devHooksDir = path.join(
        devWorkspaceRoot,
        'packages/tiny-brain-plugin/hooks',
      );
      devBinDir = path.join(devHooksDir, 'dev-bin');
      devShimPath = path.join(devBinDir, 'tiny-brain');

      await fs.mkdir(cliDistDir, { recursive: true });
      await fs.mkdir(devBinDir, { recursive: true });

      // Synthetic workspace CLI. The sentinel string lets the end-to-end test
      // prove we actually reached this binary rather than any host binary
      // that happens to also be on PATH.
      await fs.writeFile(
        devCliPath,
        '#!/usr/bin/env node\nconsole.log("workspace-cli-sentinel-9.9.9");\n',
        'utf-8',
      );
      await fs.chmod(devCliPath, 0o755);

      // Copy the production shim verbatim so a regression in the real
      // dev-bin/tiny-brain (e.g. the $PWD-vs-$(pwd) bug that bit the
      // initial GREEN) would surface here. The shim reads __TB_DEV_CLI
      // from env; resolve-exec.sh exports it as part of the gate.
      const realShimSrc = path.resolve(__dirname, '..', 'dev-bin', 'tiny-brain');
      await fs.copyFile(realShimSrc, devShimPath);
      await fs.chmod(devShimPath, 0o755);
    });

    afterEach(async () => {
      await fs.rm(devWorkspaceRoot, { recursive: true, force: true });
    });

    function sourceInDevMode(opts: {
      cwd: string;
      devMode?: string;
      pathEnv?: string;
      probe?: string;
      shell?: 'sh' | 'bash';
    }): { stdout: string; stderr: string; status: number | null } {
      const shell = opts.shell ?? 'sh';
      const probe = opts.probe ?? `printf 'EXEC=[%s]' "$EXEC"`;
      // The dev-bin shim's `exec node …` needs node on PATH. In a real
      // dev session it lives wherever the user installed it (homebrew,
      // nvm, asdf); under vitest, process.execPath points at the same
      // node the test runner is using. Appending its directory keeps the
      // dev-bin shim shadowed first (prepended by the gate) while still
      // letting the shim find a node interpreter.
      const nodeDir = path.dirname(process.execPath);
      const env: NodeJS.ProcessEnv = {
        PATH: opts.pathEnv ?? `/usr/bin:/bin:${nodeDir}`,
      };
      if (opts.devMode !== undefined) env.__TB_DEV_MODE = opts.devMode;
      try {
        const stdout = execFileSync(
          shell,
          ['-c', `. ${JSON.stringify(RESOLVE_EXEC)} && ${probe}`],
          {
            cwd: opts.cwd,
            encoding: 'utf-8',
            env,
            stdio: ['ignore', 'pipe', 'pipe'],
          },
        );
        return { stdout, stderr: '', status: 0 };
      } catch (err) {
        const e = err as { stdout?: Buffer; stderr?: Buffer; status?: number };
        return {
          stdout: e.stdout?.toString() ?? '',
          stderr: e.stderr?.toString() ?? '',
          status: e.status ?? null,
        };
      }
    }

    it('sets EXEC="" and prepends the workspace dev-bin to PATH so `command -v tiny-brain` resolves to the shim', () => {
      // CWD inside the fake workspace's hooks dir — same shape a real hook
      // process sees when it sources resolve-exec.sh.
      // Also probes that the gate's internal scratch variables (_TB_WS,
      // _TB_FOUND, _TB_DEV_BIN) are unset before return — mirrors the
      // existing `_PM` no-leak defence.
      const result = sourceInDevMode({
        cwd: devHooksDir,
        devMode: '1',
        probe: `printf 'EXEC=[%s] CMD=[%s] WS=[%s] FOUND=[%s] DEV_BIN=[%s]' "$EXEC" "$(command -v tiny-brain)" "${'$'}{_TB_WS:-unset}" "${'$'}{_TB_FOUND:-unset}" "${'$'}{_TB_DEV_BIN:-unset}"`,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('EXEC=[]');
      // command -v must resolve to the workspace's dev-bin shim, NOT any host
      // tiny-brain that might exist outside the synthetic PATH.
      expect(result.stdout).toContain(`CMD=[${devShimPath}]`);
      expect(result.stdout).toContain('WS=[unset]');
      expect(result.stdout).toContain('FOUND=[unset]');
      expect(result.stdout).toContain('DEV_BIN=[unset]');
    });

    it('routes tiny-brain through the dev-bin shim to the workspace CLI (end-to-end)', () => {
      // The end-to-end probe: after sourcing in dev mode, invoking
      // `tiny-brain` must execute the workspace cli.js — proven by the
      // sentinel string written into the fake binary.
      const result = sourceInDevMode({
        cwd: devHooksDir,
        devMode: '1',
        probe: `tiny-brain`,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toBe('workspace-cli-sentinel-9.9.9\n');
    });

    it('prefers live TS source via tsx when src/cli.ts and an executable tsx are present', async () => {
      // The fix: under dev mode the workspace SOURCE is the source of truth.
      // When packages/tiny-brain/src/cli.ts and <root>/node_modules/.bin/tsx
      // both exist, the shim must exec tsx-on-source (no rebuild) instead of
      // node-on-bundle. A tsx sentinel distinct from the bundle's proves which
      // path ran; the fake tsx echoes the entry it was handed so we also pin
      // that the shim passed src/cli.ts (not the dist bundle).
      const srcDir = path.join(devWorkspaceRoot, 'packages/tiny-brain/src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(path.join(srcDir, 'cli.ts'), '// live source\n', 'utf-8');

      const binDir = path.join(devWorkspaceRoot, 'node_modules/.bin');
      await fs.mkdir(binDir, { recursive: true });
      const fakeTsx = path.join(binDir, 'tsx');
      await fs.writeFile(fakeTsx, '#!/bin/sh\necho "tsx-source-sentinel:$1"\n', 'utf-8');
      await fs.chmod(fakeTsx, 0o755);

      const result = sourceInDevMode({
        cwd: devHooksDir,
        devMode: '1',
        probe: `tiny-brain`,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toBe(
        `tsx-source-sentinel:${path.join(srcDir, 'cli.ts')}\n`,
      );
    });

    it('falls back to node-on-bundle when src is present but tsx is not installed', async () => {
      // Graceful degradation: a workspace with source but no tsx binary (e.g.
      // deps not installed) must still run — via the bundle — rather than
      // erroring on a missing tsx. Pins the fallback half of the preference.
      const srcDir = path.join(devWorkspaceRoot, 'packages/tiny-brain/src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(path.join(srcDir, 'cli.ts'), '// live source\n', 'utf-8');
      // No node_modules/.bin/tsx created.

      const result = sourceInDevMode({
        cwd: devHooksDir,
        devMode: '1',
        probe: `tiny-brain`,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toBe('workspace-cli-sentinel-9.9.9\n');
    });

    it('is a no-op when __TB_DEV_MODE is unset, even with the workspace layout present in CWD ancestry', () => {
      // Plugin users who happen to have the monorepo checked out (or who CD
      // into the repo for unrelated reasons) must NOT be redirected to the
      // workspace — they want the existing global / PM-fallback contract.
      // PATH has no tiny-brain → PM fallback. No analysis.json → npx default.
      // Probe also asserts:
      //   - $PATH is byte-identical to what we passed in (the gate didn't
      //     prepend dev-bin or otherwise mutate PATH)
      //   - _TB_WS doesn't leak into the caller (mirrors the existing
      //     `_PM no-leak` defence at line ~166)
      //   - __TB_DEV_CLI isn't exported
      // A regression that always walked up but only prepended PATH when the
      // env var was set would still pass an EXEC-only assertion; these
      // extra probes close that hole.
      preconditionNoHostTb('/usr/bin:/bin');
      const result = sourceInDevMode({
        cwd: devHooksDir,
        pathEnv: '/usr/bin:/bin',
        probe: `printf 'EXEC=[%s] PATH=[%s] TB_WS=[%s] TB_CLI=[%s]' "$EXEC" "$PATH" "${'$'}{_TB_WS:-unset}" "${'$'}{__TB_DEV_CLI:-unset}"`,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toBe(
        'EXEC=[npx] PATH=[/usr/bin:/bin] TB_WS=[unset] TB_CLI=[unset]',
      );
    });

    // Dual-shell coverage: `return 1` from sourced scripts is one of
    // the documented sh-vs-bash divergence areas. The cartesian product
    // {non-executable, missing} × {sh, bash} covers both "shim broken"
    // states under both shells. Diagnostic assertions use the literal
    // computed path rather than the substring "dev-bin" so a regression
    // that swapped the concrete path for generic prose would fail.
    it.each([
      {
        shell: 'sh' as const,
        shimState: 'non-executable',
        mutate: () => fs.chmod(devShimPath, 0o644),
      },
      {
        shell: 'bash' as const,
        shimState: 'non-executable',
        mutate: () => fs.chmod(devShimPath, 0o644),
      },
      {
        shell: 'sh' as const,
        shimState: 'missing',
        mutate: () => fs.rm(devShimPath, { force: true }),
      },
      {
        shell: 'bash' as const,
        shimState: 'missing',
        mutate: () => fs.rm(devShimPath, { force: true }),
      },
    ])(
      'exits non-zero with a diagnostic when __TB_DEV_MODE=1 but the dev-bin shim is $shimState (shell=$shell)',
      async ({ shell, mutate }) => {
        // Inverts the Task 1 silent-fallthrough pin: rather than letting
        // the gate fall through to the existing PATH / PM logic, the
        // helper aborts noisily so the developer fixes the broken state
        // instead of unknowingly running the stale global CLI.
        await mutate();
        const result = sourceInDevMode({
          cwd: devHooksDir,
          devMode: '1',
          pathEnv: '/usr/bin:/bin',
          shell,
        });
        expect(result.status).not.toBe(0);
        expect(result.stderr).toMatch(/__TB_DEV_MODE/);
        expect(result.stderr).toContain(devShimPath);
        expect(result.stderr).toMatch(/npm run build:plugin/);
      },
    );

    it.each(['sh', 'bash'] as const)(
      'exits non-zero with a diagnostic when __TB_DEV_MODE=1 but the workspace cli.js is not in CWD ancestry (shell=%s)',
      (shell) => {
        // Walks from a CWD outside any tiny-brain workspace — e.g. an
        // external plugin user who set __TB_DEV_MODE=1 by mistake. The
        // gate must abort with a clear cause and remediation instead of
        // silently falling through to the global CLI (which would
        // re-introduce exactly the bug class this fix exists to close).
        const result = sourceInDevMode({
          cwd: os.tmpdir(),
          devMode: '1',
          pathEnv: '/usr/bin:/bin',
          shell,
        });
        expect(result.status).not.toBe(0);
        expect(result.stderr).toMatch(/__TB_DEV_MODE/);
        expect(result.stderr).toMatch(/cli\.js/);
        expect(result.stderr).toMatch(/npm run build/);
      },
    );

    it('the dev-bin shim itself exits non-zero with a fatal diagnostic when invoked without __TB_DEV_CLI', () => {
      // Pins the shim's user-facing error path — fires when something
      // (a stray PATH entry, a broken alias) puts the shim on PATH
      // without the gate having sourced. Invokes the production shim
      // directly so a regression in its fatal-branch wording is caught.
      const realShim = path.resolve(__dirname, '..', 'dev-bin', 'tiny-brain');
      const nodeDir = path.dirname(process.execPath);
      let result: { status: number | null; stderr: string; stdout: string };
      try {
        const stdout = execFileSync(realShim, [], {
          encoding: 'utf-8',
          // No __TB_DEV_CLI in env. PATH carries node for the shim's
          // own #!/bin/sh exec path (though sh is found via /bin).
          env: { PATH: `/usr/bin:/bin:${nodeDir}` },
          stdio: ['ignore', 'pipe', 'pipe'],
        });
        result = { status: 0, stderr: '', stdout };
      } catch (err) {
        const e = err as {
          stdout?: Buffer;
          stderr?: Buffer;
          status?: number;
        };
        result = {
          status: e.status ?? null,
          stderr: e.stderr?.toString() ?? '',
          stdout: e.stdout?.toString() ?? '',
        };
      }
      expect(result.status).not.toBe(0);
      expect(result.stderr).toMatch(/dev-bin tiny-brain shim/);
      expect(result.stderr).toMatch(/__TB_DEV_CLI/);
    });
  });
});
