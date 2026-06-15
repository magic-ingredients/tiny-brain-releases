import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

/**
 * stable-uuid-identity F8 Task 1 — the `/plan` skill must delegate creation to
 * `tb work add` instead of writing PRD / feature / task markdown by hand. Under
 * the UUID identity model the CLI renders frontmatter (id slug + generated
 * `uuid:`) and assigns task ordering; the skill never authors raw `id:` /
 * `uuid:` lines, and the old `task-{featureNumber}-{taskIndex}` derivation rule
 * is obsolete.
 *
 * These are content checks, not behavioural — the skill is markdown read by the
 * harness. We pin the canonical creation path + the absence of the obsolete
 * derivation rule so a regression that re-teaches hand-authored markdown fails
 * pointing at the right phrase.
 */
describe('plan skill — delegates PRD/feature/task creation to `tb work add`', () => {
  const skillPath = path.resolve(__dirname, '..', 'plan', 'SKILL.md');
  let content = '';

  beforeAll(async () => {
    content = await fs.readFile(skillPath, 'utf-8');
  });

  it('teaches the three `tb work add` creation commands', () => {
    expect(content).toMatch(/tb work add prd/);
    expect(content).toMatch(/tb work add feature/);
    expect(content).toMatch(/tb work add task/);
  });

  it('teaches the task command in its `--feature`-only form (--prd is disambiguation-only)', () => {
    // `tb work add task` resolves the parent feature on its own; `--prd` is a
    // disambiguation flag, NOT a required parent selector (see create-task.ts
    // resolveParentPath). The primary task command must be shown without --prd,
    // and --prd must be documented as the ambiguity escape hatch — otherwise the
    // doc teaches a false contract.
    expect(content).toMatch(/tb work add task --feature/);
    expect(content).toMatch(/--prd[\s\S]{0,80}?(optional|disambiguat|ambiguous)/i);
  });

  it('drops the obsolete `task-{featureNumber}-{taskIndex}` derivation rule', () => {
    // Under UUIDs the matching key is the task description (resolved to a UUID
    // at hook time), not a position-derived `task-N-M` id. The derivation rule
    // is a shape-derived convention that no longer exists.
    expect(content).not.toMatch(/task-\{featureNumber\}/);
    expect(content).not.toMatch(/task-\{number\}-\{n\}/);
  });

  it('does not instruct the model to author raw id:/uuid: frontmatter by hand', () => {
    // The CLI renders frontmatter with the generated uuid. The skill must not
    // teach a hand-written `id: descriptive-kebab-case-id` frontmatter block.
    expect(content).not.toMatch(/id:\s*descriptive-kebab-case-id/);
    expect(content).not.toMatch(/id:\s*feature-kebab-case-id/);
  });

  it('explains that the CLI generates UUIDs so humans never type them', () => {
    expect(content).toMatch(/uuid/i);
    expect(content).toMatch(/\bslug\b/i);
  });
});
