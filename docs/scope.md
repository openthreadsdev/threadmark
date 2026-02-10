# Scope Boundary Document — v1

## Product Vision

Production-ready, enterprise-grade compliance data management platform embedded within Shopify admin, enabling EU-facing merchants to track, manage, and export product compliance information.

## In Scope (v1 Core Features)

1. **Shopify embedded app** with OAuth and session management
2. **Automated product sync** via webhooks and scheduled reconciliation
3. **Compliance data editor** with validation
4. **Multi-material composition tracking** with percentage validation (must sum to 100%)
5. **Certification and document attachment** support
6. **Audit trail** for all compliance field changes (append-only)
7. **JSON and PDF exports** with versioning
8. **QR code generation** for public compliance pages
9. **Multi-tenant architecture** with shop-level data isolation
10. **Role-based access control** (admin / editor / viewer)
11. **Compliance status dashboard** and reporting

## Out of Scope (v1 Exclusions)

The following are explicitly excluded from v1. These are not planned, not partially supported, and should not be built:

| Exclusion | Rationale |
|-----------|-----------|
| Payment processing, checkout, or cart functionality | Commerce functions remain with Shopify |
| Tax calculation engines | Separate domain, out of product scope |
| Shipping or logistics integrations | Separate domain, out of product scope |
| Blockchain or distributed ledger technology | Unnecessary complexity for v1 |
| AI/ML features (predictive compliance, auto-categorization) | Future consideration only |
| Multi-currency support beyond display | Not relevant to compliance data |
| Inventory management | Shopify handles this natively |
| Customer-facing storefront modifications | App does not modify the storefront |
| Third-party marketplace integrations (Amazon, eBay, etc.) | Shopify-only for v1 |
| Real-time collaboration features | Not needed for v1 personas |
| Mobile native apps (web-responsive only) | Embedded app is web-based |
| Automated regulatory compliance checking | Merchants are responsible for regulatory interpretation |
| Supply chain tracking beyond supplier reference | Single supplier reference field only |

## Boundary Notes

- The platform focuses solely on **compliance data management and export**
- All commerce functions (payments, shipping, inventory) remain with Shopify
- Any regulatory interpretation or legal compliance validation is the **merchant's responsibility**
- The app does not advise on, validate, or enforce regulatory correctness — it provides a structured data management tool

## Future Considerations (Not v1)

These are acknowledged as potential future directions but are not committed:

- Digital Product Passport (DPP) requirements
- Extended Producer Responsibility (EPR) data
- Carbon footprint calculations
- Repair and disassembly instructions
- Bulk editing workflows
- Multi-marketplace support

## Stakeholder Sign-Off

| Stakeholder | Role | Status |
|-------------|------|--------|
| Product Lead | Scope approval | Pending |
| Engineering Lead | Feasibility confirmation | Pending |
| Legal / Compliance Advisor | Regulatory disclaimer review | Pending |
