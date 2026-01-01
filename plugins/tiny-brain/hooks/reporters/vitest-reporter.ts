/**
 * Vitest Reporter for TDD Guard
 *
 * Outputs test results to .claude/tdd-guard/data/test.json
 * for the TDD validation hook to check.
 *
 * Usage in vitest.config.ts:
 *   import { tddGuardReporter } from 'tiny-brain-plugin/hooks/reporters/vitest-reporter';
 *
 *   export default defineConfig({
 *     test: {
 *       reporters: ['default', tddGuardReporter()]
 *     }
 *   });
 */

import type { Reporter, File, TaskResultPack } from 'vitest';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

interface TddGuardResult {
  timestamp: string;
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  duration: number;
  failedTests: Array<{
    name: string;
    file: string;
    error?: string;
  }>;
}

const TDD_GUARD_DIR = '.claude/tdd-guard/data';
const TEST_RESULTS_FILE = 'test.json';

export function tddGuardReporter(): Reporter {
  let startTime: number;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  const failedTests: TddGuardResult['failedTests'] = [];

  return {
    onInit() {
      startTime = Date.now();
      passed = 0;
      failed = 0;
      skipped = 0;
      failedTests.length = 0;
    },

    onTaskUpdate(packs: TaskResultPack[]) {
      for (const pack of packs) {
        const [, result] = pack;
        if (!result) continue;

        if (result.state === 'pass') {
          passed++;
        } else if (result.state === 'fail') {
          failed++;
        } else if (result.state === 'skip') {
          skipped++;
        }
      }
    },

    onFinished(files?: File[]) {
      // Collect failed test details
      if (files) {
        for (const file of files) {
          collectFailedTests(file.tasks, file.filepath, failedTests);
        }
      }

      const result: TddGuardResult = {
        timestamp: new Date().toISOString(),
        passed,
        failed,
        skipped,
        total: passed + failed + skipped,
        duration: Date.now() - startTime,
        failedTests,
      };

      // Ensure directory exists
      const outputDir = join(process.cwd(), TDD_GUARD_DIR);
      mkdirSync(outputDir, { recursive: true });

      // Write results
      const outputPath = join(outputDir, TEST_RESULTS_FILE);
      writeFileSync(outputPath, JSON.stringify(result, null, 2));

      if (failed > 0) {
        console.log(`\n📝 TDD Guard: ${failed} failing test(s) recorded`);
      } else {
        console.log('\n✅ TDD Guard: All tests passing');
      }
    },
  };
}

function collectFailedTests(
  tasks: any[],
  filepath: string,
  failedTests: TddGuardResult['failedTests']
): void {
  for (const task of tasks) {
    if (task.type === 'suite' && task.tasks) {
      collectFailedTests(task.tasks, filepath, failedTests);
    } else if (task.type === 'test' && task.result?.state === 'fail') {
      failedTests.push({
        name: task.name,
        file: filepath,
        error: task.result.errors?.[0]?.message,
      });
    }
  }
}

export default tddGuardReporter;
