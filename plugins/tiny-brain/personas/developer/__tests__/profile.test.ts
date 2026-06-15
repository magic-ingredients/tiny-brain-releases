import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

/**
 * Fix: developer-persona-stale-pipeline-entrypoint.
 *
 * The developer persona system block is loaded into every Claude
 * session via the SessionStart hook — the most reliable injection
 * point for operational rules — so it must name the CURRENT task
 * entrypoint. The git-sourced status pivot (ADR-0006/0007) retired
 * `tiny-brain pipeline … --agent red` (and its `redStartedAt` /
 * `phase.entered` side effects) in favour of `tiny-brain task start`.
 *
 * Content tests — the persona is markdown read by the harness,
 * not executable. We pin the load-bearing command literal plus
 * the section it's required to live in (`## System Rules`) so a
 * future trim that drops it surfaces at the right place.
 */
describe('developer persona — start-a-task rule in System Rules', () => {
  const profilePath = path.resolve(__dirname, '..', 'profile.md');
  let content = '';

  beforeAll(async () => {
    content = await fs.readFile(profilePath, 'utf-8');
  });

  /** Carve out just the System Rules section — everything between
   *  the `## System Rules` heading and the next `## ` heading. The
   *  SessionStart hook injects the whole SYSTEM-BLOCK, but the rule
   *  must specifically live in System Rules (operational gates),
   *  not System Details (stance prose) or User Rules (operator-
   *  editable, may be absent). Tests anchor here so a refactor that
   *  shuffles the rule into Details gets caught. */
  function extractSystemRules(md: string): string {
    const start = md.indexOf('## System Rules');
    if (start < 0) throw new Error('## System Rules heading missing');
    const rest = md.substring(start + '## System Rules'.length);
    const nextSection = rest.search(/\n## /);
    return nextSection < 0 ? rest : rest.substring(0, nextSection);
  }

  it('System Rules block contains the literal `tiny-brain task start --task …` command — the entrypoint the operator MUST run before any tracked task (the git-sourced status pivot retired `pipeline … --agent red`)', () => {
    const rules = extractSystemRules(content);
    // Pin the command-shaped substring. Regex uses [\s\S]* so a
    // future reflow that splits the phrase across a line break
    // still matches.
    expect(rules).toMatch(/tiny-brain task start[\s\S]*--task/);
  });

  it('System Rules block does NOT resurrect the obsolete `tiny-brain pipeline … --agent red` entrypoint or its dead `redStartedAt` / `phase.entered` rationale — all removed by the git-sourced status pivot (ADR-0006/0007)', () => {
    const rules = extractSystemRules(content);
    expect(rules).not.toMatch(/tiny-brain pipeline[\s\S]*--agent red/);
    expect(rules).not.toMatch(/redStartedAt/);
    expect(rules).not.toMatch(/phase\.entered/);
  });

  it('System Rules block names the git-sourced rationale — status is derived from commits the `post-commit` hook reads — so a refactor that strips the WHY surfaces here', () => {
    const rules = extractSystemRules(content);
    expect(rules).toMatch(/git-sourced/);
    expect(rules).toMatch(/post-commit/);
  });

  it('the start-a-task rule is NOT in System Details — Details carries stance prose ("Pipeline-led", "Skill-first" etc.) and may be skimmed; Rules is the load-bearing operational gate. The negative assertion catches a refactor that demotes the rule from Rules to Details', () => {
    const detailsIdx = content.indexOf('## System Details');
    const blockEnd = content.indexOf('<!-- SYSTEM-BLOCK-END -->');
    expect(detailsIdx).toBeGreaterThan(0);
    expect(blockEnd).toBeGreaterThan(detailsIdx);
    const detailsBlock = content.substring(detailsIdx, blockEnd);
    // The specific command form must NOT appear in Details — if a
    // refactor moves the rule down, this fires before test 1 can
    // false-positive on the moved copy.
    expect(detailsBlock).not.toMatch(/tiny-brain task start[\s\S]*--task/);
  });

  it('version advances past the last shipped floor (4.1.0) — this rule change is a contract change, so the metadata.json `version` must bump for consumers to detect it. Asserting strictly-greater (not merely `!==` an old value) pins the ADVANCEMENT itself, so a future rule edit that forgets the bump is caught. The SYSTEM-BLOCK `Version:` line and metadata.json must agree (two surfaces for the same value)', async () => {
    const metadataPath = path.resolve(__dirname, '..', 'metadata.json');
    const raw = await fs.readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(raw) as { version: string; lastUpdated: string };
    // Anchor: version is strictly greater than the floor shipped
    // before this fix (4.1.0). Pins the bump, not just inequality to
    // some arbitrary old value — a stale edit that leaves the version
    // at the floor now fails here.
    const floor = [4, 1, 0];
    const parts = metadata.version.split('.').map(Number);
    const cmp =
      (parts[0] - floor[0]) || (parts[1] - floor[1]) || (parts[2] - floor[2]);
    expect(cmp).toBeGreaterThan(0);
    // Scope the Version-line check to the SYSTEM-BLOCK only —
    // operator User-block content shouldn't be able to mask drift
    // by adding its own `Version:` line.
    const systemBlockStart = content.indexOf('<!-- SYSTEM-BLOCK-START -->');
    const systemBlockEnd = content.indexOf('<!-- SYSTEM-BLOCK-END -->');
    expect(systemBlockStart).toBeGreaterThanOrEqual(0);
    expect(systemBlockEnd).toBeGreaterThan(systemBlockStart);
    const systemBlock = content.substring(systemBlockStart, systemBlockEnd);
    expect(systemBlock).toMatch(
      new RegExp(`Version:\\s*${metadata.version.replace(/\./g, '\\.')}`),
    );
  });
});
