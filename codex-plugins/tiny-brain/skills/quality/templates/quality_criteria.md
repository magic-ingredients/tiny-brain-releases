# Quality Criteria Standards

This document defines the quality categories, weights, and standards used for code quality analysis.

## Scoring Overview

- **Maximum Score**: 100 points
- **Calculation**: Start at 100, subtract points for issues based on category weight and severity
- **Grades**: A (90-100), B (80-89), C (70-79), D (60-69), F (<60)

### Scoring Formula

For each issue, the score deduction is calculated as:

```
deduction = category_weight * severity_multiplier
```

Where:
- `category_weight` is the weight of the issue's category (see Categories and Weights table)
- `severity_multiplier` is determined by the issue's severity level (see Issue Severity Multipliers table)

**Example calculations:**
- A `critical` Security issue: `15 * 1.0 = 15.0` points deducted
- A `major` Security issue: `15 * 0.7 = 10.5` points deducted
- A `minor` Maintainability issue: `5 * 0.3 = 1.5` points deducted
- An `info` issue (any category): `weight * 0.0 = 0` points deducted

The final score is: `max(0, 100 - sum(all_deductions))`

Per-category grades are calculated by treating each category as a 100-point scale and applying the same deduction logic within that category only.

## Categories and Weights

| Category | Weight | Primary Agent |
|----------|--------|---------------|
| Security | 15 | matching specialist reviewer |
| Reliability | 10 | performance-engineer |
| Performance | 10 | performance-engineer |
| Maintainability | 5 | reviewer |
| Testing | 5 | tdd-validator |
| Architecture | 5 | architect |
| Documentation | 3 | reviewer |
| Operations | 3 | architect |

## Issue Severity Multipliers

| Severity | Multiplier | Description |
|----------|------------|-------------|
| critical | 1.0x | Full weight deduction |
| major | 0.7x | 70% of weight |
| minor | 0.3x | 30% of weight |
| info | 0.0x | No deduction (informational only) |

## Category Standards

### Security (15 points)
- No hardcoded secrets or credentials
- Input validation on all external data
- Proper authentication/authorization patterns
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding)
- CSRF protection where applicable
- Secure dependency versions
- No sensitive data in logs

### Reliability (10 points)
- Proper error handling (no swallowed errors)
- Graceful degradation for failures
- Timeout handling for external calls
- Retry logic for transient failures
- Resource cleanup (connections, file handles)
- No race conditions in async code
- Proper null/undefined handling

### Performance (10 points)
- No N+1 query patterns
- Appropriate caching strategies
- Efficient algorithms for data size
- Lazy loading where beneficial
- No blocking operations on main thread
- Optimized database queries
- Memory leak prevention

### Maintainability (5 points)
- Consistent code style
- Meaningful variable/function names
- Single responsibility principle
- Reasonable function length (<50 lines)
- Low cyclomatic complexity (<10)
- No code duplication
- Clear control flow

### Testing (5 points)
- Unit tests for business logic
- Integration tests for APIs
- Test coverage > 80% for critical paths
- Tests are readable and maintainable
- No flaky tests
- Proper test isolation
- Edge cases covered

### Architecture (5 points)
- Clear separation of concerns
- Dependency injection where appropriate
- Interface-based design
- No circular dependencies
- Appropriate abstraction levels
- Consistent patterns throughout
- Scalable design

### Documentation (3 points)
- API endpoints documented
- Complex logic explained
- README with setup instructions
- Type definitions for public APIs
- Inline comments for non-obvious code
- Change log maintained

### Operations (3 points)
- Structured logging
- Health check endpoints
- Configuration via environment
- Graceful shutdown handling
- Monitoring hooks available
- Deployment documentation
- Error reporting integration

## Evidence Requirements

Every quality finding MUST include an `evidence` field containing 3-5 lines of actual code from the repository. Evidence requirements differ by category:

| Category | Evidence Should Show |
|----------|---------------------|
| Security | The vulnerable code path (e.g., unsanitized input, hardcoded secret, missing auth check) |
| Reliability | The failure-prone code (e.g., missing error handler, unguarded null access, missing timeout) |
| Performance | The inefficient code (e.g., N+1 query loop, blocking call, unnecessary recomputation) |
| Maintainability | The problematic pattern (e.g., complex nested conditions, duplicated blocks, long function) |
| Testing | The untested code path or the flawed test (e.g., missing assertion, test without cleanup) |
| Architecture | The structural violation (e.g., circular import, layer bypass, god class header) |
| Documentation | The undocumented public API or stale doc alongside the current code |
| Operations | The missing operational concern (e.g., no health check, hardcoded config, no graceful shutdown) |

**Evidence formatting:**
- Use actual code from the file, not pseudocode
- Include the most relevant 3-5 lines, not entire functions
- Preserve indentation for readability
- Include a comment if the issue is not visually obvious

## Effort Estimation Guidelines

Each finding MUST include an `effort` level and `effortHours` estimate. Use these calibration guidelines:

| Effort Level | Hours Range | Typical Scope |
|-------------|-------------|---------------|
| `trivial` | 0.25 - 1 | Single-line fix, rename, add a null check |
| `small` | 1 - 4 | Extract a function, add error handling, write a missing test |
| `medium` | 4 - 16 | Refactor a module, fix a design pattern, add integration test suite |
| `large` | 16 - 40 | Restructure a package, eliminate circular dependencies, add auth layer |
| `epic` | 40+ | Major architectural change, rewrite a subsystem, migrate a framework |

**Per-category typical ranges:**

| Category | Common Effort Range | Notes |
|----------|---------------------|-------|
| Security | small - large | Secrets rotation = small; adding auth layer = large |
| Reliability | trivial - medium | Null checks = trivial; retry/circuit-breaker = medium |
| Performance | small - large | Adding index = small; query redesign = large |
| Maintainability | trivial - medium | Renaming = trivial; decomposing god class = medium |
| Testing | small - medium | Single test = small; test suite for module = medium |
| Architecture | medium - epic | Extract interface = medium; break circular deps = large |
| Documentation | trivial - small | Inline comments = trivial; API docs = small |
| Operations | small - medium | Add health check = small; structured logging overhaul = medium |

## Theme Taxonomy

Standard theme names organized by category. Agents MUST use these exact theme strings for consistent grouping and trending:

### Security Themes
| Theme | Description |
|-------|-------------|
| `input-validation` | Missing or insufficient input sanitization |
| `secrets-management` | Hardcoded secrets, credentials in code |
| `auth-hardening` | Weak authentication or authorization patterns |
| `injection` | SQL, command, or code injection vulnerabilities |
| `xss` | Cross-site scripting vulnerabilities |
| `csrf` | Cross-site request forgery vulnerabilities |
| `dependency-vulnerability` | Known vulnerable dependency versions |

### Reliability Themes
| Theme | Description |
|-------|-------------|
| `error-handling` | Missing or swallowed error handling |
| `null-safety` | Unguarded null/undefined access |
| `timeout-handling` | Missing timeouts on external calls |
| `resource-cleanup` | Unclosed connections, file handles, listeners |
| `race-condition` | Concurrent access without synchronization |
| `retry-logic` | Missing retry for transient failures |

### Performance Themes
| Theme | Description |
|-------|-------------|
| `n-plus-one` | N+1 query patterns |
| `blocking-io` | Blocking operations on main thread/event loop |
| `memory-leak` | Objects retained beyond their useful life |
| `caching` | Missing or ineffective caching strategy |
| `unnecessary-computation` | Redundant calculations or re-renders |
| `bundle-size` | Unnecessarily large bundle or dependency |

### Maintainability Themes
| Theme | Description |
|-------|-------------|
| `complexity` | High cyclomatic complexity |
| `naming` | Unclear or inconsistent naming |
| `duplication` | Repeated code that should be extracted |
| `type-safety` | Weak typing, any usage, unsafe casts |
| `dead-code` | Unused variables, functions, imports |
| `god-class` | Module with too many responsibilities |
| `long-method` | Functions exceeding 50 lines |
| `magic-numbers` | Unexplained literal values |

### Testing Themes
| Theme | Description |
|-------|-------------|
| `missing-coverage` | Business logic without test coverage |
| `flaky-tests` | Tests with non-deterministic results |
| `test-isolation` | Tests with shared mutable state |
| `test-quality` | Tests without meaningful assertions |
| `mock-complexity` | Over-mocked tests that don't test real behavior |

### Architecture Themes
| Theme | Description |
|-------|-------------|
| `circular-deps` | Circular dependencies between modules |
| `layering-violation` | Component bypasses its proper architectural layer |
| `god-class` | Module with too many responsibilities |
| `tight-coupling` | Concrete dependencies where abstractions are needed |
| `missing-abstraction` | Repeated patterns needing a shared interface |
| `dependency-management` | Unmanaged or inconsistent dependency versions |

### Documentation Themes
| Theme | Description |
|-------|-------------|
| `missing-docs` | Missing API or module documentation |
| `stale-docs` | Documentation that no longer matches code |
| `missing-types` | Public APIs without type definitions |

### Operations Themes
| Theme | Description |
|-------|-------------|
| `missing-health-check` | No health or readiness endpoints |
| `missing-logging` | Insufficient structured logging |
| `missing-config` | Hardcoded values that should be configurable |
| `missing-graceful-shutdown` | No cleanup on process termination |
| `missing-monitoring` | No metrics or observability hooks |

## Standard References

When applicable, findings SHOULD include standard reference identifiers for traceability:

### Security References

| Reference Type | Format | Example | When to Use |
|---------------|--------|---------|-------------|
| CWE | `CWE-{number}` | `CWE-79` | All security findings |
| OWASP Top 10 | `OWASP-A{number}` | `OWASP-A03` | Web application security |
| OWASP ASVS | `ASVS-{section}` | `ASVS-5.1.3` | Detailed verification |

**Common CWE mappings:**

| Vulnerability | CWE ID | Description |
|--------------|--------|-------------|
| XSS | CWE-79 | Improper Neutralization of Input During Web Page Generation |
| SQL Injection | CWE-89 | Improper Neutralization of Special Elements used in SQL Command |
| Command Injection | CWE-78 | Improper Neutralization of Special Elements used in an OS Command |
| Path Traversal | CWE-22 | Improper Limitation of a Pathname to a Restricted Directory |
| Hardcoded Credentials | CWE-798 | Use of Hard-coded Credentials |
| Insecure Deserialization | CWE-502 | Deserialization of Untrusted Data |
| Missing Auth | CWE-862 | Missing Authorization |
| Sensitive Data Exposure | CWE-200 | Exposure of Sensitive Information |
| CSRF | CWE-352 | Cross-Site Request Forgery |

**Common OWASP Top 10 (2021) mappings:**

| Category | ID | Description |
|----------|----|-------------|
| Broken Access Control | OWASP-A01 | Access control failures |
| Cryptographic Failures | OWASP-A02 | Failures related to cryptography |
| Injection | OWASP-A03 | SQL, NoSQL, OS, LDAP injection |
| Insecure Design | OWASP-A04 | Missing or ineffective security controls |
| Security Misconfiguration | OWASP-A05 | Insecure default configurations |
| Vulnerable Components | OWASP-A06 | Known vulnerable dependencies |
| Auth Failures | OWASP-A07 | Authentication and session failures |
| Data Integrity Failures | OWASP-A08 | Insecure CI/CD, unsigned updates |
| Logging Failures | OWASP-A09 | Insufficient logging and monitoring |
| SSRF | OWASP-A10 | Server-Side Request Forgery |

## Customization

This file can be customized per-repository to adjust:
- Category weights for project priorities
- Severity thresholds for specific rules
- Additional project-specific standards
- Theme tags for project-specific concerns
- Effort calibration ranges for your team's velocity

To customize, copy this file to `.tiny-brain/quality/quality_criteria.md` in your repository and modify as needed.
