# System Architecture

## System Overview

```mermaid
graph TB
    subgraph Shopify["Shopify Platform"]
        ShopifyAdmin["Shopify Admin"]
        ShopifyAPI["Shopify REST/GraphQL API"]
        ShopifyWebhooks["Shopify Webhooks"]
        ShopifyBilling["Shopify Billing API"]
        ShopifyOAuth["Shopify OAuth 2.0"]
    end

    subgraph Threadmark["Threadmark Platform"]
        subgraph Apps["Applications"]
            EmbeddedApp["Shopify Admin App\n(Remix + Polaris)\n/apps/shopify-admin"]
            API["REST API\n(OpenAPI 3.0)\n/apps/api"]
            Worker["Background Worker\n(BullMQ)\n/apps/worker"]
        end

        subgraph Packages["Shared Packages"]
            DB["Database Package\n(Prisma ORM)\n/packages/db"]
            Shared["Shared Utils\n(Types, Validation)\n/packages/shared"]
        end

        subgraph Infrastructure["Infrastructure"]
            Postgres[("PostgreSQL 15\n(Primary Store)")]
            Redis[("Redis 7\n(Job Queue + Cache)")]
            S3["Object Storage\n(S3-compatible)\n(Exports)"]
        end
    end

    subgraph External["External Consumers"]
        PublicPages["Public Compliance Pages\n(QR Code Access)"]
        Customer["End Customer"]
    end

    ShopifyAdmin -->|"App Bridge"| EmbeddedApp
    ShopifyOAuth -->|"OAuth 2.0 Token"| EmbeddedApp
    ShopifyWebhooks -->|"HMAC-signed events"| API
    EmbeddedApp -->|"HTTP"| API
    API -->|"Enqueue jobs"| Redis
    Worker -->|"Dequeue jobs"| Redis
    Worker -->|"Fetch products"| ShopifyAPI
    Worker -->|"Upload exports"| S3
    API --> DB
    Worker --> DB
    DB --> Postgres
    API -->|"Verify charges"| ShopifyBilling
    PublicPages --> API
    Customer -->|"Scan QR code"| PublicPages
```

## Component Descriptions

| Component | Workspace | Purpose |
|-----------|-----------|---------|
| Shopify Admin App | `/apps/shopify-admin` | Remix embedded app with Polaris UI. Handles OAuth, session management, and compliance data editing UI. Runs inside Shopify Admin via App Bridge. |
| REST API | `/apps/api` | OpenAPI 3.0 REST API. Handles webhook ingestion, CRUD operations, RBAC enforcement, audit logging, and serves public compliance pages. |
| Background Worker | `/apps/worker` | BullMQ-based job processor. Handles product sync (webhook + scheduled reconciliation), export generation (JSON/PDF), and data retention cleanup. |
| Database Package | `/packages/db` | Prisma ORM schema, migrations, and client. Shared across API and Worker. |
| Shared Package | `/packages/shared` | Shared TypeScript types, validation schemas (Zod), constants, and utility functions. |
| PostgreSQL | Docker / Cloud | Primary data store. ACID-compliant. Stores tenants, products, compliance records, audit logs, users, and exports. |
| Redis | Docker / Cloud | Job queue backing store (BullMQ). Also used for rate limiting (token bucket) and session caching. |
| Object Storage | S3-compatible | Stores generated export files (JSON, PDF). Serves via signed URLs with configurable expiry. |

## Multi-Tenancy Model

All data is isolated at the shop (tenant) level. Every table except `tenants` includes a `tenant_id` foreign key. Queries are scoped to the authenticated tenant via middleware.

```mermaid
graph LR
    subgraph Tenant_A["Tenant A (shop-a.myshopify.com)"]
        A_Products["Products"]
        A_Compliance["Compliance Records"]
        A_Audit["Audit Logs"]
        A_Users["Users (admin, editor, viewer)"]
    end

    subgraph Tenant_B["Tenant B (shop-b.myshopify.com)"]
        B_Products["Products"]
        B_Compliance["Compliance Records"]
        B_Audit["Audit Logs"]
        B_Users["Users (admin, editor, viewer)"]
    end

    DB_Single[("Single PostgreSQL Database\nRow-level tenant isolation")]

    Tenant_A --> DB_Single
    Tenant_B --> DB_Single
```

## RBAC Model

| Role | Products | Compliance Data | Exports | Audit Logs | Settings |
|------|----------|----------------|---------|------------|----------|
| Admin | Read | Read / Write | Create / Download | Read | Read / Write |
| Editor | Read | Read / Write | Create / Download | Read | Read |
| Viewer | Read | Read | Download | Read | Read |

---

## Data Flow Diagrams

### 1. OAuth Installation and Authentication

```mermaid
sequenceDiagram
    participant M as Merchant
    participant SA as Shopify Admin
    participant SO as Shopify OAuth
    participant App as Embedded App
    participant API as REST API
    participant DB as PostgreSQL

    M->>SA: Install app from App Store
    SA->>SO: Initiate OAuth flow
    SO->>App: Redirect with auth code
    App->>SO: Exchange code for access token
    SO-->>App: Access token + shop info
    App->>API: Create/update tenant
    API->>DB: Upsert tenant record (encrypted token)
    API-->>App: Session established
    App->>API: Trigger initial product sync
    API->>DB: Queue sync job
    App-->>M: Show onboarding + sync progress
```

### 2. Product Sync (Webhook-Triggered)

```mermaid
sequenceDiagram
    participant Shopify as Shopify
    participant API as REST API
    participant Redis as Redis (Queue)
    participant Worker as Worker
    participant DB as PostgreSQL

    Shopify->>API: POST /webhooks (HMAC-signed)
    API->>API: Verify HMAC signature
    API->>Redis: Enqueue sync job
    API-->>Shopify: 200 OK (fast response)
    Worker->>Redis: Dequeue job
    Worker->>DB: Upsert product (idempotent)
    Worker->>DB: Recalculate compliance status
    Worker->>DB: Write audit log entry
```

### 3. Product Sync (Scheduled Reconciliation)

```mermaid
sequenceDiagram
    participant Cron as Scheduled Trigger
    participant Worker as Worker
    participant Shopify as Shopify API
    participant DB as PostgreSQL

    Cron->>Worker: Trigger nightly reconciliation
    loop Cursor-based pagination
        Worker->>Shopify: GET /products (cursor)
        Shopify-->>Worker: Product batch + next cursor
        Worker->>DB: Compare with internal records
        Worker->>DB: Update drifted records
        Worker->>DB: Log discrepancies
    end
    Worker->>DB: Write reconciliation summary
```

### 4. Compliance Data Editing with Audit Trail

```mermaid
sequenceDiagram
    participant M as Merchant
    participant App as Embedded App
    participant API as REST API
    participant DB as PostgreSQL

    M->>App: Open product compliance editor
    App->>API: GET /products/:id/compliance
    API->>DB: Fetch compliance record
    DB-->>API: Current compliance data
    API-->>App: Compliance data + validation rules
    M->>App: Edit fields, save changes
    App->>API: PUT /products/:id/compliance
    API->>API: Validate inputs (Zod)
    API->>DB: Begin transaction
    API->>DB: Snapshot old values
    API->>DB: Update compliance record (version++)
    API->>DB: Insert audit log entry
    API->>DB: Recalculate compliance status
    API->>DB: Commit transaction
    API-->>App: Updated record
    App-->>M: Success confirmation
```

### 5. Export Generation and Delivery

```mermaid
sequenceDiagram
    participant M as Merchant
    participant App as Embedded App
    participant API as REST API
    participant Redis as Redis (Queue)
    participant Worker as Worker
    participant DB as PostgreSQL
    participant S3 as Object Storage

    M->>App: Click Export (JSON or PDF)
    App->>API: POST /exports
    API->>DB: Create export record (status: queued)
    API->>Redis: Enqueue export job
    API-->>App: Export ID + status: queued
    Worker->>Redis: Dequeue job
    Worker->>DB: Update status: processing
    Worker->>DB: Fetch compliance data
    Worker->>Worker: Generate file (JSON/PDF)
    Worker->>S3: Upload file
    S3-->>Worker: File URL
    Worker->>DB: Update export (status: completed, URL, size)
    Worker->>DB: Write audit log entry
    M->>App: Check export status
    App->>API: GET /exports/:id
    API-->>App: Signed download URL
    M->>S3: Download via signed URL
```

---

## Environments

| Environment | Purpose | Infrastructure |
|-------------|---------|---------------|
| Development | Local dev machines | Docker Compose (Postgres + Redis), Shopify CLI tunnel |
| Staging | Pre-production testing | Cloud-hosted, test Shopify store |
| Production | Live merchant data | Cloud-hosted, live Shopify stores |

Configuration is managed via environment variables injected through CI/CD secrets.

## Cross-Cutting Concerns

| Concern | Approach |
|---------|----------|
| Logging | Structured JSON logs with correlation IDs and log levels |
| Metrics | Prometheus-compatible metrics or APM integration |
| Tracing | OpenTelemetry for distributed tracing (optional v1) |
| Rate Limiting | Per-tenant and global limits via Redis-backed token bucket |
| Input Validation | Centralized Zod schemas in `@threadmark/shared` |
| Error Handling | Structured error responses with correlation IDs |

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo Tool | Turborepo | Lightweight, fast caching, good npm workspace integration |
| ORM | Prisma | Type-safe client generation, migration tooling, schema-first design |
| Database | PostgreSQL 15 | ACID compliance, JSONB for structured compliance data, audit trail support |
| Job Queue | BullMQ (Redis-backed) | Reliable job processing, retries, scheduling, dashboard |
| Frontend Framework | Remix | Shopify's recommended framework for embedded apps |
| UI Components | Polaris | Shopify's design system for admin apps |
| Validation | Zod | TypeScript-first schema validation, composable, good error messages |
