import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docPath = resolve(__dirname, "../system-overview.md");
const doc = readFileSync(docPath, "utf-8");

describe("system-overview.md exists and is non-empty", () => {
  it("file exists", () => {
    expect(existsSync(docPath)).toBe(true);
  });

  it("has substantial content", () => {
    expect(doc.length).toBeGreaterThan(1000);
  });
});

describe("system architecture diagram", () => {
  it("contains a Mermaid diagram", () => {
    expect(doc).toContain("```mermaid");
  });

  it("shows all three application workspaces", () => {
    expect(doc).toContain("shopify-admin");
    expect(doc).toContain("/apps/api");
    expect(doc).toContain("/apps/worker");
  });

  it("shows both shared packages", () => {
    expect(doc).toContain("/packages/db");
    expect(doc).toContain("/packages/shared");
  });

  it("shows infrastructure components", () => {
    expect(doc).toContain("PostgreSQL");
    expect(doc).toContain("Redis");
    expect(doc).toContain("Object Storage");
  });

  it("shows Shopify platform components", () => {
    expect(doc).toContain("Shopify Admin");
    expect(doc).toContain("Shopify OAuth");
    expect(doc).toContain("Shopify Webhooks");
  });
});

describe("component descriptions table", () => {
  const components = [
    "Shopify Admin App",
    "REST API",
    "Background Worker",
    "Database Package",
    "Shared Package",
    "PostgreSQL",
    "Redis",
    "Object Storage",
  ];

  for (const component of components) {
    it(`describes ${component}`, () => {
      expect(doc).toContain(component);
    });
  }
});

describe("data flow diagrams", () => {
  const requiredFlows = [
    "OAuth Installation and Authentication",
    "Product Sync (Webhook-Triggered)",
    "Product Sync (Scheduled Reconciliation)",
    "Compliance Data Editing with Audit Trail",
    "Export Generation and Delivery",
  ];

  for (const flow of requiredFlows) {
    it(`documents ${flow} flow`, () => {
      expect(doc).toContain(flow);
    });
  }

  it("uses sequence diagrams for data flows", () => {
    expect(doc).toContain("sequenceDiagram");
  });
});

describe("multi-tenancy documentation", () => {
  it("documents tenant isolation model", () => {
    expect(doc).toContain("tenant_id");
    expect(doc).toContain("tenant isolation");
  });
});

describe("RBAC model documentation", () => {
  const roles = ["Admin", "Editor", "Viewer"];

  for (const role of roles) {
    it(`documents ${role} role`, () => {
      expect(doc).toContain(role);
    });
  }
});

describe("cross-cutting concerns", () => {
  const concerns = [
    "Logging",
    "Metrics",
    "Rate Limiting",
    "Input Validation",
  ];

  for (const concern of concerns) {
    it(`addresses ${concern}`, () => {
      expect(doc).toContain(concern);
    });
  }
});

describe("technology decisions", () => {
  const decisions = [
    "Turborepo",
    "Prisma",
    "PostgreSQL",
    "BullMQ",
    "Remix",
    "Polaris",
    "Zod",
  ];

  for (const tech of decisions) {
    it(`documents ${tech} decision`, () => {
      expect(doc).toContain(tech);
    });
  }
});

describe("environments documentation", () => {
  const environments = ["Development", "Staging", "Production"];

  for (const env of environments) {
    it(`documents ${env} environment`, () => {
      expect(doc).toContain(env);
    });
  }
});
