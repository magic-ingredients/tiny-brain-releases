"""
Pytest Plugin for TDD Guard

Outputs test results to .claude/tdd-guard/data/test.json
for the TDD validation hook to check.

Usage:
  pip install tiny-brain-plugin
  pytest --tdd-guard

Or in conftest.py:
  pytest_plugins = ['tiny_brain_plugin.hooks.reporters.pytest_reporter']
"""

import json
import os
import time
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any

import pytest

TDD_GUARD_DIR = ".claude/tdd-guard/data"
TEST_RESULTS_FILE = "test.json"


class TddGuardPlugin:
    def __init__(self):
        self.start_time = None
        self.passed = 0
        self.failed = 0
        self.skipped = 0
        self.failed_tests: List[Dict[str, Any]] = []

    def pytest_sessionstart(self, session):
        self.start_time = time.time()
        self.passed = 0
        self.failed = 0
        self.skipped = 0
        self.failed_tests = []

    def pytest_runtest_logreport(self, report):
        if report.when == "call":
            if report.passed:
                self.passed += 1
            elif report.failed:
                self.failed += 1
                self.failed_tests.append({
                    "name": report.nodeid,
                    "file": str(report.fspath) if report.fspath else "",
                    "error": str(report.longrepr) if report.longrepr else None,
                })
            elif report.skipped:
                self.skipped += 1

    def pytest_sessionfinish(self, session, exitstatus):
        duration = int((time.time() - self.start_time) * 1000)

        result = {
            "timestamp": datetime.now().isoformat(),
            "passed": self.passed,
            "failed": self.failed,
            "skipped": self.skipped,
            "total": self.passed + self.failed + self.skipped,
            "duration": duration,
            "failedTests": self.failed_tests,
        }

        # Ensure directory exists
        output_dir = Path.cwd() / TDD_GUARD_DIR
        output_dir.mkdir(parents=True, exist_ok=True)

        # Write results
        output_path = output_dir / TEST_RESULTS_FILE
        with open(output_path, "w") as f:
            json.dump(result, f, indent=2)

        if self.failed > 0:
            print(f"\n📝 TDD Guard: {self.failed} failing test(s) recorded")
        else:
            print("\n✅ TDD Guard: All tests passing")


def pytest_addoption(parser):
    parser.addoption(
        "--tdd-guard",
        action="store_true",
        default=False,
        help="Enable TDD Guard reporter",
    )


def pytest_configure(config):
    if config.getoption("--tdd-guard"):
        config.pluginmanager.register(TddGuardPlugin(), "tdd_guard")


# Auto-register when imported as a plugin
@pytest.hookimpl(tryfirst=True)
def pytest_load_initial_conftests(early_config, parser, args):
    # Check if --tdd-guard is in args or if we're being used as a plugin
    if "--tdd-guard" in args:
        return
    # When imported directly, always enable
    early_config.pluginmanager.register(TddGuardPlugin(), "tdd_guard")
