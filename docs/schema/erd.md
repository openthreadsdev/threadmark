# Entity Relationship Diagram

## Mermaid ERD

```mermaid
erDiagram
    tenants ||--o{ products : "has"
    tenants ||--o{ users : "has"
    tenants ||--o{ exports : "has"
    tenants ||--o{ audit_logs : "has"
    products ||--o| compliance_records : "has"
    products ||--o{ audit_logs : "about"
    products ||--o{ exports : "includes"
    users ||--o{ audit_logs : "performs"
    users ||--o{ exports : "requests"

    tenants {
        uuid id PK
        text shop_domain UK "e.g. myshop.myshopify.com"
        bigint shopify_shop_id UK
        text access_token_encrypted "AES-256 encrypted"
        text shop_name
        text shop_email
        text plan "free | pro | enterprise"
        text status "active | suspended | uninstalled"
        timestamptz installed_at
        timestamptz uninstalled_at
        jsonb settings "shop-level preferences"
        timestamptz created_at
        timestamptz updated_at
    }

    products {
        uuid id PK
        uuid tenant_id FK
        bigint shopify_product_id "unique per tenant"
        text title
        text handle
        text vendor
        text product_type
        text shopify_status "active | draft | archived"
        text compliance_status "pending | in_progress | complete | exported"
        timestamptz shopify_updated_at
        timestamptz synced_at
        boolean is_deleted "soft delete"
        timestamptz created_at
        timestamptz updated_at
    }

    compliance_records {
        uuid id PK
        uuid product_id FK "unique"
        uuid tenant_id FK
        jsonb material_composition "array: material + percentage (sum 100%)"
        text country_of_manufacture "ISO 3166-1 alpha-2"
        text supplier_reference "max 255 chars"
        jsonb certifications "array: type, body, number, dates, doc URL"
        text care_instructions "max 1000 chars"
        numeric recycled_content_pct "0-100"
        text safety_warnings "max 500 chars"
        text environmental_impact "max 1000 chars"
        jsonb product_dimensions "length, width, height (cm), weight (kg)"
        jsonb chemical_compliance "array: regulation, compliant, notes, report URL"
        integer version "incremented on each update"
        timestamptz created_at
        timestamptz updated_at
    }

    audit_logs {
        uuid id PK
        uuid tenant_id FK
        uuid product_id FK "nullable"
        uuid user_id FK "nullable"
        text action "create | update | delete | export | sync"
        text entity_type "compliance_record | product | export | tenant"
        uuid entity_id
        jsonb old_value "previous state"
        jsonb new_value "new state"
        text ip_address
        text user_agent
        timestamptz created_at "immutable, append-only"
    }

    users {
        uuid id PK
        uuid tenant_id FK
        bigint shopify_user_id UK
        text email
        text first_name
        text last_name
        text role "admin | editor | viewer"
        boolean is_active
        timestamptz last_login_at
        timestamptz created_at
        timestamptz updated_at
    }

    exports {
        uuid id PK
        uuid tenant_id FK
        uuid product_id FK "nullable for bulk exports"
        uuid requested_by FK "user who requested"
        text format "json | pdf"
        text status "queued | processing | completed | failed"
        text file_url "S3 URL"
        bigint file_size_bytes
        integer version
        jsonb filters "criteria used for bulk exports"
        text error_message "if failed"
        timestamptz completed_at
        timestamptz expires_at "for signed URL expiry"
        timestamptz created_at
    }
```

## Table Descriptions

### tenants
Represents a Shopify shop installation. Each shop is an isolated tenant. Stores encrypted access tokens and shop metadata. Row-level tenant isolation is enforced via `tenant_id` on all other tables.

### products
Mirrors Shopify products via webhook sync. Tracks both Shopify status and internal compliance status. Supports soft deletion (`is_deleted`) so compliance records are preserved when a Shopify product is deleted.

### compliance_records
One-to-one with products. Stores all 10 compliance attributes defined in the PRD. Structured/list fields (material composition, certifications, chemical compliance, product dimensions) use JSONB columns. Includes a `version` counter incremented on each update.

### audit_logs
Append-only table recording all compliance data changes. No UPDATE or DELETE operations permitted. Captures who changed what, when, with before/after snapshots in JSONB. Supports querying by tenant, product, user, action type, or time range.

### users
Shopify users associated with a tenant. Supports three roles: `admin` (full access), `editor` (read/write compliance data), `viewer` (read-only). Role is used by RBAC middleware for authorization.

### exports
Tracks export requests and their lifecycle (queued, processing, completed, failed). Supports both single-product and bulk exports in JSON or PDF format. Files are stored in S3 with expiring signed URLs.

## Key Indexes

| Table | Columns | Purpose |
|-------|---------|---------|
| products | `(tenant_id, shopify_product_id)` UNIQUE | Prevent duplicate products per tenant |
| products | `(tenant_id, compliance_status)` | Dashboard filtering |
| products | `(tenant_id, is_deleted)` | Exclude soft-deleted from queries |
| compliance_records | `(product_id)` UNIQUE | One record per product |
| compliance_records | `(tenant_id)` | Tenant-scoped queries |
| audit_logs | `(tenant_id, created_at)` | Tenant audit history |
| audit_logs | `(product_id, created_at)` | Product change history |
| users | `(tenant_id, shopify_user_id)` UNIQUE | Unique user per tenant |
| exports | `(tenant_id, created_at)` | Export history |

## Constraints

- All tables use UUIDs as primary keys (v4)
- `tenant_id` is required on every table except `tenants` itself
- `audit_logs` has no UPDATE/DELETE triggers — enforced at application level and via DB rule
- `compliance_records.material_composition` percentages must sum to 100 (validated at application level)
- `compliance_records.recycled_content_pct` constrained to 0-100
- `compliance_records.version` starts at 1 and increments with each update
- `products.(tenant_id, shopify_product_id)` is unique
- All timestamps use `timestamptz` (timezone-aware)
