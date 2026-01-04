# Quality Criteria Standards

This document defines the quality categories, weights, and standards used for code quality analysis.

## Scoring Overview

- **Maximum Score**: 100 points
- **Calculation**: Start at 100, subtract points for issues based on category weight and severity
- **Grades**: A (90-100), B (80-89), C (70-79), D (60-69), F (<60)

## Categories and Weights

| Category | Weight | Primary Agent |
|----------|--------|---------------|
| Security | 15 | security-reviewer |
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

## Customization

This file can be customized per-repository to adjust:
- Category weights for project priorities
- Severity thresholds for specific rules
- Additional project-specific standards

To customize, copy this file to `docs/quality/quality_criteria.md` in your repository and modify as needed.
