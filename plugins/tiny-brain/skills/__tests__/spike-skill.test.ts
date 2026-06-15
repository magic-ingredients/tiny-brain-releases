import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SKILL_PATH = path.resolve(__dirname, '..', 'spike', 'SKILL.md');

describe('spike SKILL.md — commit-type documentation', () => {
  // The fix `agents-md-defer-data-to-analysis-json` Task 2 adds `spike:`
  // as the conventional-commit prefix for spike-tracked work. The
  // SKILL.md is the discoverability path for spike authors — if it
  // doesn't document `spike:`, authors keep using `feat:` for spike
  // work and the new prefix stays dormant.

  function loadSkill(): string {
    return fs.readFileSync(SKILL_PATH, 'utf-8');
  }

  it('introduces a dedicated section about the spike: commit-type prefix', () => {
    // The Spike: header alone was already mentioned pre-fix — pin the
    // NEW section heading the fix added so a regression that drops it
    // can't pass by relying on the pre-existing Spike: token.
    const content = loadSkill();
    expect(content).toMatch(/^###?\s+Commit-type prefix for spike work/m);
  });

  it('documents the Spike: + Task: header requirement under the spike: prefix', () => {
    // The prefix without the header guidance lets authors land
    // header-less commits the commit-msg hook will reject. Pin both
    // headers explicitly in the new section so the documentation
    // stays in lockstep with the commit-msg hook's required headers.
    const content = loadSkill();
    const sectionMatch = content.match(/###?\s+Commit-type prefix for spike work[\s\S]*?(?=\n##\s+|\Z)/);
    expect(sectionMatch).not.toBeNull();
    const section = sectionMatch?.[0] ?? '';

    expect(section).toContain('`spike:`');
    expect(section).toMatch(/Spike:/);
    expect(section).toMatch(/Task:/);
  });

  it('contrasts spike: vs feat: — explains when to use each for spike-tracked work', () => {
    // The post-commit pipeline triggers spike-review on feat: + Spike:
    // commits but NOT on spike: + Spike: commits. The SKILL.md is the
    // only place this distinction is documented (the commit-msg hook
    // implements but doesn't explain it). Pin both prefixes inside
    // the new section so the guidance can't drift to mention only one.
    const content = loadSkill();
    const sectionMatch = content.match(/###?\s+Commit-type prefix for spike work[\s\S]*?(?=\n##\s+|\Z)/);
    const section = sectionMatch?.[0] ?? '';

    expect(section).toContain('`spike:`');
    expect(section).toContain('`feat:`');
    // The reason to choose one over the other — without a hint at
    // the trigger semantics, the contrast becomes useless prose.
    expect(section).toMatch(/spike-review|pipeline|trigger/i);
  });
});
