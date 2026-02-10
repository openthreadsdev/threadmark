# User Personas

## Persona 1: EU-Facing Shopify Merchant (Primary User)

### Profile

| Attribute | Detail |
|-----------|--------|
| Business size | 5-200 SKUs |
| Industries | Textiles, Apparel, Furniture, Home Goods |
| Geography | EU-based or selling to EU customers |
| Technical skill | Low to medium (Shopify admin users) |
| Compliance awareness | Medium to high (aware of EU regulations) |

### Pain Points

- Manual tracking of compliance data in spreadsheets
- No centralized system for product compliance records
- Difficulty providing compliance documentation to customers
- Risk of regulatory non-compliance and fines
- Time-consuming audit preparation
- Inconsistent data across products

### Goals

- Centralize compliance data for all products
- Easily update and maintain compliance records
- Generate compliance exports for audits
- Provide transparency to customers
- Reduce compliance risk
- Save time on administrative tasks

### Success Metrics

| Metric | How We Measure |
|--------|---------------|
| Time to complete compliance records per product | Track time from first edit to "complete" status |
| Percentage of products with complete compliance data | Dashboard metric: products at "complete" / total products |
| Time saved during audits | User survey and export generation frequency |
| Customer inquiries resolved via public pages | Public page view analytics |

### Design Implications

- UI must be simple and approachable — avoid technical jargon
- Inline help and tooltips for compliance fields (e.g., what "REACH SVHC" means)
- Single-product editing flow should be the primary path
- Compliance status should be visible at a glance from the product list
- Onboarding should guide the user through their first compliance record

---

## Persona 2: Compliance Officer / Operations Manager (Secondary User)

### Profile

| Attribute | Detail |
|-----------|--------|
| Business size | 50-200 SKUs (larger operations) |
| Role | Dedicated compliance or ops role |
| Technical skill | Medium |
| Regulatory knowledge | High |

### Pain Points

- Need comprehensive audit trails
- Require bulk data management capabilities
- Must ensure data accuracy and completeness
- Coordinate with multiple suppliers

### Goals

- Maintain audit-ready compliance documentation
- Monitor compliance status across product catalog
- Generate regulatory reports
- Track changes over time

### Design Implications

- Audit log must be easily accessible and filterable per product
- Dashboard should show compliance coverage across the entire catalog
- Bulk export (JSON/PDF) is a key workflow for this persona
- Filtering products by compliance status, supplier, or certification is important
- Change history per product must show before/after diffs

---

## Persona Validation Checklist

The following should be validated with target merchants before or during beta:

- [ ] Confirm that the 10 compliance attributes cover the most common regulatory needs
- [ ] Validate that the primary workflow (single-product compliance editing) matches merchant mental models
- [ ] Confirm that export formats (JSON, PDF) meet audit submission requirements
- [ ] Verify that the compliance status progression (pending → in_progress → complete → exported) is intuitive
- [ ] Assess whether bulk editing is needed for v1 or can wait for a future release
- [ ] Gather feedback on public compliance page usefulness and field visibility preferences
