# Non-Functional Requirements Checklist

A feature or system component is considered "enterprise-grade" when **all** of the following criteria are met.

---

## Security

- [ ] OAuth 2.0 implementation with secure token storage
- [ ] All webhook endpoints verify HMAC signatures
- [ ] Secrets managed via environment variables or vault (never in code)
- [ ] HTTPS/TLS required for all communications
- [ ] Content Security Policy (CSP) headers for embedded app
- [ ] SQL injection prevention via parameterized queries/ORM
- [ ] XSS prevention via output encoding
- [ ] CSRF protection for state-changing operations
- [ ] Rate limiting to prevent abuse (per-tenant and global)
- [ ] Input validation and sanitization on all endpoints
- [ ] Principle of least privilege for Shopify API scopes

## Audit Trail

- [ ] Append-only audit log for all compliance data changes
- [ ] Audit entries include: timestamp, user ID, tenant ID, action, old value, new value
- [ ] Audit log queryable and exportable
- [ ] Immutable audit records (no updates or deletes)
- [ ] Audit log retention policy documented and enforced

## Observability

- [ ] Structured JSON logging with log levels (ERROR, WARN, INFO, DEBUG)
- [ ] Request tracing with correlation IDs
- [ ] Metrics instrumentation: request latency, error rates, webhook failures, job queue depth
- [ ] Health check endpoints (/health, /readiness)
- [ ] Application Performance Monitoring (APM) integration ready
- [ ] Alerting rules defined for critical failures
- [ ] Dashboard for monitoring webhook delivery and sync status

## Backups and Disaster Recovery

- [ ] Automated daily database backups with point-in-time recovery
- [ ] Backup retention: 30 days minimum
- [ ] Backup restoration tested quarterly
- [ ] Object storage (exports, attachments) replicated or backed up
- [ ] Documented disaster recovery procedures (RTO/RPO targets)
- [ ] Database migration rollback plan

## Test Coverage

- [ ] Unit test coverage: ≥80% for business logic
- [ ] Integration tests for all API endpoints
- [ ] E2E tests for critical user flows (install, sync, edit, export)
- [ ] Webhook handler idempotency tests
- [ ] Load testing for webhook handlers and sync jobs
- [ ] Security testing: basic SAST in CI, dependency scanning

## Service Level Objectives (SLOs)

- [ ] API endpoint p99 latency: <500ms for read operations, <2s for write operations
- [ ] Webhook processing latency: <30s from receipt to completion
- [ ] Export generation: <60s for single product, <5 minutes for bulk
- [ ] Uptime: 99.5% monthly (excluding scheduled maintenance)
- [ ] Data sync accuracy: 99.9% (reconciliation catches drift)

## Documentation

- [ ] README with local development setup
- [ ] Architecture documentation with diagrams (Mermaid)
- [ ] API documentation (OpenAPI spec)
- [ ] Data model documentation (ERD, schema descriptions)
- [ ] Operations runbook (troubleshooting, common issues)
- [ ] Security posture documentation
- [ ] Deployment and release process documented
- [ ] ADRs (Architecture Decision Records) for major design choices

## Multi-Tenancy

- [ ] Tenant isolation enforced at database query level (row-level security or middleware)
- [ ] Tenant ID derived from authenticated Shopify session
- [ ] No cross-tenant data leakage (validated via tests)
- [ ] Tenant-scoped rate limiting
- [ ] Tenant-scoped audit logs

## Data Integrity

- [ ] Database constraints enforce referential integrity
- [ ] Validation logic for all compliance fields
- [ ] Transaction boundaries for operations requiring atomicity
- [ ] Idempotent webhook handlers (duplicate webhook tolerance)
- [ ] Data migration scripts tested and reversible

## Compliance and Privacy

- [ ] GDPR-compliant data handling (deletion, export on request)
- [ ] Privacy policy and data retention policy documented
- [ ] PII handling documented (minimize collection)
- [ ] Data processing agreement (DPA) ready
- [ ] Webhook payload logging excludes sensitive customer data

## Code Quality and Standards

- [ ] Pre-commit hooks enforce linting, formatting, and type checking
- [ ] ESLint configured with project-specific rules
- [ ] Prettier configured for consistent code formatting
- [ ] TypeScript strict mode enabled
- [ ] Conventional Commits enforced via commitlint
- [ ] Secret scanning in pre-commit hooks (gitleaks or similar)
- [ ] Code review required for all changes
- [ ] No console.log statements in production code
- [ ] Dead code elimination verified
- [ ] Import statements organized and unused imports removed

## CI/CD and Deployment

- [ ] Comprehensive CI pipeline in GitHub Actions
- [ ] All tests (unit, integration, e2e) run in CI
- [ ] Code coverage ≥80% enforced in CI
- [ ] SAST scanning integrated (CodeQL, Semgrep, or Snyk)
- [ ] Dependency vulnerability scanning automated
- [ ] Build artifacts signed via GitHub Attestation API
- [ ] Deployment to staging automated on main branch merge
- [ ] Production deployment requires manual approval
- [ ] Zero-downtime deployment strategy
- [ ] Rollback procedures documented and tested
- [ ] Environment-specific configurations managed securely

## Supply Chain Security

- [ ] All production artifacts signed with GitHub Attestations
- [ ] Attestations include build provenance (commit SHA, workflow, timestamp)
- [ ] Deployment pipeline verifies attestations before deployment
- [ ] Dependency pinning with lock files committed
- [ ] Dependabot configured for automated dependency updates
- [ ] SBOM (Software Bill of Materials) generated for releases
- [ ] Container images scanned for vulnerabilities
- [ ] Base images from trusted sources only

## Accessibility

- [ ] WCAG 2.1 AA compliance mandatory for all UI components
- [ ] eslint-plugin-jsx-a11y configured and enforced
- [ ] axe-core integrated into component tests
- [ ] pa11y integrated into E2E test suite
- [ ] All interactive elements have proper ARIA labels and roles
- [ ] All form inputs have associated labels
- [ ] Color contrast meets WCAG AA standards (4.5:1 for normal text)
- [ ] Keyboard navigation fully functional (no mouse-only interactions)
- [ ] Screen reader testing performed on critical flows
- [ ] Focus indicators visible and clear
- [ ] No accessibility violations in pre-commit or CI

---

## Performance and Scalability Targets

| Category | Metric | Target |
|----------|--------|--------|
| Performance | API latency (reads) | p99 <500ms |
| Performance | API latency (writes) | p99 <2s |
| Performance | Webhook processing | <30s end-to-end |
| Performance | Export generation | <60s single product |
| Performance | Sync throughput | 1000 products/minute |
| Scalability | Concurrent tenants | 1000+ |
| Scalability | Products per tenant | Up to 10,000 |
| Scalability | Concurrent webhooks | 100 without degradation |
| Reliability | Uptime | 99.5% monthly SLA |
| Reliability | Sync accuracy | 99.9% with reconciliation |
| Reliability | Webhook reliability | Retry with exponential backoff |
| Security | Authentication | OAuth 2.0 with Shopify |
| Security | Authorization | RBAC (admin/editor/viewer) |
| Security | Encryption | TLS in transit, at rest for sensitive fields |
| Maintainability | Code quality | Pre-commit hooks, ESLint, Prettier, TypeScript strict |
| Maintainability | Test coverage | ≥80% business logic |
| Maintainability | Deployment | Zero-downtime with rollback |
| Accessibility | WCAG compliance | WCAG 2.1 AA for all UI components |
| Accessibility | Automated testing | eslint-plugin-jsx-a11y, axe-core, pa11y |
| Accessibility | Keyboard navigation | All interactions accessible without mouse |
| Supply Chain | Artifact signing | GitHub Attestation API for all builds |
| Supply Chain | Dependency scanning | Automated vulnerability scanning in CI |
| Supply Chain | SBOM | Software Bill of Materials for releases |
