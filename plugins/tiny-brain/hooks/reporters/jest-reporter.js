/**
 * Jest Reporter for TDD Guard
 *
 * Outputs test results to .claude/tdd-guard/data/test.json
 * for the TDD validation hook to check.
 *
 * Usage in jest.config.js:
 *   module.exports = {
 *     reporters: [
 *       'default',
 *       'tiny-brain-plugin/hooks/reporters/jest-reporter'
 *     ]
 *   };
 */

const fs = require('fs');
const path = require('path');

const TDD_GUARD_DIR = '.claude/tdd-guard/data';
const TEST_RESULTS_FILE = 'test.json';

class TddGuardReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    const failedTests = [];

    // Collect failed test details
    for (const testResult of results.testResults) {
      for (const assertionResult of testResult.testResults) {
        if (assertionResult.status === 'failed') {
          failedTests.push({
            name: assertionResult.fullName || assertionResult.title,
            file: testResult.testFilePath,
            error: assertionResult.failureMessages?.[0],
          });
        }
      }
    }

    const result = {
      timestamp: new Date().toISOString(),
      passed: results.numPassedTests,
      failed: results.numFailedTests,
      skipped: results.numPendingTests + results.numTodoTests,
      total: results.numTotalTests,
      duration: Date.now() - results.startTime,
      failedTests,
    };

    // Ensure directory exists
    const outputDir = path.join(process.cwd(), TDD_GUARD_DIR);
    fs.mkdirSync(outputDir, { recursive: true });

    // Write results
    const outputPath = path.join(outputDir, TEST_RESULTS_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

    if (results.numFailedTests > 0) {
      console.log(`\n📝 TDD Guard: ${results.numFailedTests} failing test(s) recorded`);
    } else {
      console.log('\n✅ TDD Guard: All tests passing');
    }
  }
}

module.exports = TddGuardReporter;
