# Non-Functional Requirements Checklist

This document defines non-functional requirements organized into three implementation tiers. Requirements are designed to be **incrementally achievable** rather than blocking early shipping.

**Enterprise buyers evaluate credibility, not checklist completion.** They care about:
- **Risk controls are credible** (security, tenancy isolation, auditability where needed)
- **Ops is reliable enough** (backups, incident response, monitoring)
- **You can prove it** (docs, logs, exportability, support process)

## How to Use This Checklist

- **Tier 0**: MVP Non-Negotiables — ship blockers; if you skip these, you'll regret it fast
- **Tier 1**: Ready for Serious Customers — required before onboarding regulated or high-value customers
- **Tier 2**: Regulated Enterprise / Procurement-Friendly — demonstrates maturity for heavily regulated industries

---

# Tier 0: MVP Non-Negotiables

These are "must-haves" for a Shopify compliance platform handling merchant data, webhooks, and multi-tenancy. **Shipping without these creates immediate technical debt or security risk.**

---

## Security Basics

- [ ] Shopify OAuth 2.0 implementation with secure session/token storage
- [ ] All webhook endpoints verify HMAC signatures
- [ ] Secrets managed via environment variables or vault (never in code)
- [ ] HTTPS/TLS required for all communications
- [ ] SQL injection prevention via parameterized queries/ORM
- [ ] XSS prevention via output encoding and sanitization
- [ ] CSRF protection for state-changing operations
- [ ] Rate limiting (global + per-tenant) to prevent abuse
- [ ] Input validation and sanitization on all endpoints
- [ ] Principle of least privilege for Shopify API scopes

## Multi-Tenancy Isolation

- [ ] Tenant isolation enforced at database query level (row-level security or middleware)
- [ ] Tenant ID derived from authenticated Shopify session
- [ ] No cross-tenant data leakage (validated via tests)

## Data Integrity

- [ ] Database constraints enforce referential integrity
- [ ] Validation logic for all compliance fields
- [ ] Transaction boundaries for operations requiring atomicity
- [ ] Idempotent webhook handlers (duplicate webhook tolerance)

## Observability Fundamentals

- [ ] Structured JSON logging with log levels and redaction of sensitive data
- [ ] Request tracing with correlation IDs
- [ ] Key metrics instrumented: webhook failures, queue depth, error rate
- [ ] Health check endpoints (/health, /readiness)

## Compliance and Privacy Fundamentals

- [ ] Webhook payload logging excludes sensitive customer data
- [ ] PII handling documented (minimize collection, document what you store)
- [ ] Basic retention/deletion story documented (even if manual initially)
- [ ] Privacy policy draft prepared

## Basic Backups

- [ ] Automated database backups enabled
- [ ] Documented restore steps exist and have been tested once

## Documentation That Unblocks Dev + Ops

- [ ] README with local development setup
- [ ] Architecture sketch (can be simple diagram)
- [ ] API documentation (OpenAPI spec or equivalent)
- [ ] Basic runbook (common issues, troubleshooting)

## Baseline Tests

- [ ] Unit tests for business logic (webhook handlers, compliance validation)
- [ ] Webhook idempotency tests (critical for Shopify integration)
- [ ] E2E test for "golden path" (install → sync → edit → export)
- [ ] Multi-tenancy isolation test (no cross-tenant leakage)

## Code Quality Essentials

- [ ] Pre-commit hooks enforce linting, formatting, and type checking
- [ ] ESLint configured with project-specific rules
- [ ] Prettier configured for consistent code formatting
- [ ] TypeScript strict mode enabled
- [ ] Conventional Commits enforced via commitlint
- [ ] Secret scanning in pre-commit hooks (gitleaks or similar)
- [ ] Structured logging enforced (no debug logs in production builds)

---

# Tier 1: Ready for Serious Customers

These requirements demonstrate operational maturity and should be in place before onboarding regulated or high-value customers.

---

## Audit Trail (Queryable)

- [ ] Audit log for all compliance data changes
- [ ] Audit entries include: timestamp, user ID, tenant ID, action, old value, new value
- [ ] Audit log queryable and exportable
- [ ] Audit log retention policy documented and enforced
- [ ] Restricted write access to audit table (append-focused, but not necessarily WORM)

## Improved Observability

- [ ] Alerting rules defined for critical failures (webhook failures, sync failures, error spikes)
- [ ] Dashboard for monitoring webhook delivery and sync status
- [ ] Application Performance Monitoring (APM) integration ready
- [ ] Tenant-scoped audit logs

## Backups and Basic DR

- [ ] Automated daily database backups with point-in-time recovery
- [ ] Backup retention: 30 days minimum
- [ ] Backup restoration tested (at least once before first serious customer)
- [ ] Object storage (exports, attachments) replicated or backed up
- [ ] Database migration rollback plan documented

## Expanded Test Coverage

- [ ] Integration tests for all API endpoints
- [ ] E2E tests for critical user flows (install, sync, edit, export)
- [ ] Unit test coverage: ≥80% for business logic
- [ ] Basic load testing for webhook handlers (validate expected throughput)

## Meaningful SLOs (Measured, Not Aspirational)

- [ ] SLO targets defined based on actual measurements (not premature commitments)
- [ ] Monitoring in place to track SLO compliance
- [ ] Internal uptime target documented (e.g., 99.5% monthly)

## Improved RBAC

- [ ] Role-based access control (admin/editor/viewer) implemented
- [ ] Tenant-scoped rate limiting enforced

## Better CI/CD

- [ ] All tests (unit, integration, e2e) run in CI
- [ ] SAST scanning integrated (CodeQL, Semgrep, or Snyk)
- [ ] Dependency vulnerability scanning automated
- [ ] Deployment to staging automated on main branch merge
- [ ] Production deployment requires manual approval
- [ ] Rollback plan documented and tested once

## Compliance Readiness

- [ ] GDPR-compliant data handling (deletion, export on request)
- [ ] Privacy policy and data retention policy finalized
- [ ] Data processing agreement (DPA) template ready

## Accessibility Baseline

- [ ] WCAG 2.1 AA as goal (not all automated gates yet)
- [ ] eslint-plugin-jsx-a11y configured and enforced
- [ ] All form inputs have associated labels
- [ ] Keyboard navigation functional for critical flows
- [ ] Focus indicators visible and clear

---

# Tier 2: Regulated Enterprise / Procurement-Friendly

These requirements demonstrate enterprise-level maturity and are valuable for heavily regulated industries or large procurement processes.

---

## Immutable Audit Trail

- [ ] Append-only, tamper-evident audit log (WORM storage or cryptographic controls)
- [ ] Immutable audit records (no updates or deletes possible)
- [ ] Audit trail integrity verification capability

## Formal Disaster Recovery

- [ ] Documented disaster recovery procedures with RTO/RPO targets
- [ ] Backup restoration tested quarterly
- [ ] Disaster recovery drill performed and documented

## Performance SLOs with p99 Guarantees

- [ ] API endpoint p99 latency: <500ms for read operations, <2s for write operations
- [ ] Webhook processing latency: <30s from receipt to completion
- [ ] Export generation: <60s for single product, <5 minutes for bulk
- [ ] Uptime: 99.5% monthly SLA (excluding scheduled maintenance)
- [ ] Data sync accuracy: 99.9% (reconciliation catches drift)
- [ ] Load testing validates performance targets under realistic workloads

## Advanced Security Testing

- [ ] Regular penetration testing or security audits
- [ ] Load testing for webhook handlers and sync jobs under stress conditions
- [ ] Security testing: comprehensive SAST in CI, dependency scanning, container scanning

## Supply Chain Security (Strong Posture)

- [ ] All production artifacts signed with GitHub Attestations
- [ ] Attestations include build provenance (commit SHA, workflow, timestamp)
- [ ] Deployment pipeline verifies attestations before deployment
- [ ] Dependency pinning with lock files committed
- [ ] Dependabot configured for automated dependency updates
- [ ] SBOM (Software Bill of Materials) generated for releases
- [ ] Container images scanned for vulnerabilities
- [ ] Base images from trusted sources only

## Zero-Downtime Deployments

- [ ] Zero-downtime deployment strategy implemented and tested
- [ ] Rollback procedures fully automated
- [ ] Blue-green or canary deployment capability

## Full Accessibility Automation

- [ ] WCAG 2.1 AA compliance mandatory for all UI components
- [ ] axe-core integrated into component tests
- [ ] pa11y integrated into E2E test suite
- [ ] All interactive elements have proper ARIA labels and roles
- [ ] Color contrast meets WCAG AA standards (4.5:1 for normal text)
- [ ] Screen reader testing performed on critical flows
- [ ] Accessibility violations block CI (pre-commit and pipeline)

## Comprehensive Documentation

- [ ] Architecture documentation with detailed diagrams (Mermaid)
- [ ] Data model documentation (ERD, schema descriptions)
- [ ] Operations runbook (comprehensive troubleshooting)
- [ ] Security posture documentation
- [ ] Deployment and release process fully documented
- [ ] ADRs (Architecture Decision Records) for major design choices

## Advanced Compliance

- [ ] Content Security Policy (CSP) headers configured and tested for embedded app (after validating Shopify iframe requirements)
- [ ] Code review required for all changes (enforced via branch protection)
- [ ] Environment-specific configurations managed securely

---

# Performance and Scalability Targets

These targets are **product strategy commitments** and should be validated through load testing with representative Shopify workloads before being claimed as guarantees.

## Tier 0: Functional Targets (MVP)

| Category | Metric | Target | Notes |
|----------|--------|--------|-------|
| Reliability | Webhook reliability | Retry with exponential backoff | Must handle Shopify webhook patterns |
| Security | Authentication | Shopify OAuth 2.0 | Specific to Shopify app auth flow |
| Security | Encryption | TLS in transit | HTTPS everywhere |

## Tier 1: Measured Objectives (Before Serious Customers)

| Category | Metric | Target | Notes |
|----------|--------|--------|-------|
| Performance | Webhook processing | <30s end-to-end | Measure under typical load |
| Performance | Export generation | <60s single product | Baseline expectation |
| Scalability | Products per tenant | Up to 10,000 | Test with real Shopify product data |
| Reliability | Uptime | 99.5% monthly | Internal target, not SLA |
| Reliability | Sync accuracy | 99.9% with reconciliation | Measure over 30 days |
| Maintainability | Test coverage | ≥80% business logic | Enforced in CI |
| Security | Authorization | RBAC (admin/editor/viewer) | Role model validated |

## Tier 2: Performance Guarantees (Enterprise SLAs)

| Category | Metric | Target | Notes |
|----------|--------|--------|-------|
| Performance | API latency (reads) | p99 <500ms | Requires APM + load testing validation |
| Performance | API latency (writes) | p99 <2s | Requires APM + load testing validation |
| Performance | Sync throughput | 1000 products/minute | Load test with Shopify rate limits |
| Scalability | Concurrent tenants | 1000+ | Stress test infrastructure |
| Scalability | Concurrent webhooks | 100 without degradation | Validate queue/worker capacity |
| Reliability | Uptime | 99.5% monthly SLA | Contractual commitment |
| Maintainability | Deployment | Zero-downtime with rollback | Blue-green or canary |
| Accessibility | WCAG compliance | WCAG 2.1 AA for all UI | Automated + manual testing |
| Supply Chain | Artifact signing | GitHub Attestation for all builds | Provenance verification in deployment |

---

## Notes on Targets

- **Tier 0 targets**: Must work functionally; performance need not be optimized yet
- **Tier 1 targets**: Measure and validate before claiming; set internal objectives
- **Tier 2 targets**: Contractual commitments requiring comprehensive testing and monitoring

**Do not claim Tier 2 targets until you have validated with load testing using representative Shopify usage patterns.**
