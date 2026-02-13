import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(__dirname, "../../prisma/schema.prisma");
const schema = readFileSync(schemaPath, "utf-8");

// Read enum values directly from the generated file instead of importing
// the full Prisma client (which requires ESM + native bindings)
const enumsPath = resolve(__dirname, "../../generated/prisma/enums.ts");
const enumsSource = readFileSync(enumsPath, "utf-8");

function extractEnumValues(source: string, enumName: string): string[] {
  const regex = new RegExp(
    `export const ${enumName} = \\{([\\s\\S]*?)\\} as const`,
  );
  const match = source.match(regex);
  if (!match) return [];
  const body = match[1];
  return [...body.matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

describe("Prisma schema validation", () => {
  it("passes prisma validate", () => {
    const result = execSync("npx prisma validate", {
      cwd: resolve(__dirname, "../.."),
      encoding: "utf-8",
    });
    expect(result).toContain("is valid");
  });
});

describe("schema defines all required models", () => {
  const expectedModels = [
    "Tenant",
    "Product",
    "ComplianceRecord",
    "AuditLog",
    "User",
    "Export",
  ];

  for (const model of expectedModels) {
    it(`defines model ${model}`, () => {
      expect(schema).toContain(`model ${model} {`);
    });
  }
});

describe("schema maps models to correct table names", () => {
  const tableMappings: Record<string, string> = {
    Tenant: "tenants",
    Product: "products",
    ComplianceRecord: "compliance_records",
    AuditLog: "audit_logs",
    User: "users",
    Export: "exports",
  };

  for (const [model, table] of Object.entries(tableMappings)) {
    it(`maps ${model} to ${table}`, () => {
      const modelRegex = new RegExp(
        `model ${model} \\{[\\s\\S]*?@@map\\("${table}"\\)`,
      );
      expect(schema).toMatch(modelRegex);
    });
  }
});

describe("schema uses UUID primary keys on all models", () => {
  const models = [
    "Tenant",
    "Product",
    "ComplianceRecord",
    "AuditLog",
    "User",
    "Export",
  ];

  for (const model of models) {
    it(`${model} uses UUID primary key`, () => {
      const modelRegex = new RegExp(
        `model ${model} \\{[\\s\\S]*?@id @default\\(uuid\\(\\)\\) @db\\.Uuid`,
      );
      expect(schema).toMatch(modelRegex);
    });
  }
});

describe("schema enforces tenant isolation", () => {
  const tenantScopedModels = [
    "Product",
    "ComplianceRecord",
    "AuditLog",
    "User",
    "Export",
  ];

  for (const model of tenantScopedModels) {
    it(`${model} has tenant_id foreign key`, () => {
      const modelRegex = new RegExp(
        `model ${model} \\{[\\s\\S]*?tenantId[\\s]+String[\\s]+@map\\("tenant_id"\\)`,
      );
      expect(schema).toMatch(modelRegex);
    });
  }
});

describe("schema defines unique constraints per ERD", () => {
  it("products has unique (tenant_id, shopify_product_id)", () => {
    expect(schema).toContain("@@unique([tenantId, shopifyProductId])");
  });

  it("compliance_records has unique product_id", () => {
    expect(schema).toMatch(
      /model ComplianceRecord \{[\s\S]*?productId[\s]+String[\s]+@unique/,
    );
  });

  it("users has unique (tenant_id, shopify_user_id)", () => {
    expect(schema).toContain("@@unique([tenantId, shopifyUserId])");
  });

  it("tenants has unique shop_domain", () => {
    expect(schema).toMatch(
      /model Tenant \{[\s\S]*?shopDomain[\s]+String[\s]+@unique/,
    );
  });

  it("tenants has unique shopify_shop_id", () => {
    expect(schema).toMatch(
      /model Tenant \{[\s\S]*?shopifyShopId[\s]+BigInt[\s]+@unique/,
    );
  });
});

describe("schema defines indexes per ERD", () => {
  it("products indexed on (tenant_id, compliance_status)", () => {
    expect(schema).toContain("@@index([tenantId, complianceStatus])");
  });

  it("products indexed on (tenant_id, is_deleted)", () => {
    expect(schema).toContain("@@index([tenantId, isDeleted])");
  });

  it("compliance_records indexed on tenant_id", () => {
    const modelRegex =
      /model ComplianceRecord \{[\s\S]*?@@index\(\[tenantId\]\)/;
    expect(schema).toMatch(modelRegex);
  });

  it("audit_logs indexed on (tenant_id, created_at)", () => {
    const modelRegex =
      /model AuditLog \{[\s\S]*?@@index\(\[tenantId, createdAt\]\)/;
    expect(schema).toMatch(modelRegex);
  });

  it("audit_logs indexed on (product_id, created_at)", () => {
    const modelRegex =
      /model AuditLog \{[\s\S]*?@@index\(\[productId, createdAt\]\)/;
    expect(schema).toMatch(modelRegex);
  });

  it("exports indexed on (tenant_id, created_at)", () => {
    const modelRegex =
      /model Export \{[\s\S]*?@@index\(\[tenantId, createdAt\]\)/;
    expect(schema).toMatch(modelRegex);
  });
});

describe("compliance_records has all 10 compliance attributes", () => {
  const attributes = [
    "materialComposition",
    "countryOfManufacture",
    "supplierReference",
    "certifications",
    "careInstructions",
    "recycledContentPct",
    "safetyWarnings",
    "environmentalImpact",
    "productDimensions",
    "chemicalCompliance",
  ];

  for (const field of attributes) {
    it(`has ${field}`, () => {
      const modelRegex = new RegExp(
        `model ComplianceRecord \\{[\\s\\S]*?${field}`,
      );
      expect(schema).toMatch(modelRegex);
    });
  }
});

describe("enums have correct values", () => {
  it("Plan enum", () => {
    expect(extractEnumValues(enumsSource, "Plan")).toEqual([
      "free",
      "pro",
      "enterprise",
    ]);
  });

  it("TenantStatus enum", () => {
    expect(extractEnumValues(enumsSource, "TenantStatus")).toEqual([
      "active",
      "suspended",
      "uninstalled",
    ]);
  });

  it("ShopifyStatus enum", () => {
    expect(extractEnumValues(enumsSource, "ShopifyStatus")).toEqual([
      "active",
      "draft",
      "archived",
    ]);
  });

  it("ComplianceStatus enum", () => {
    expect(extractEnumValues(enumsSource, "ComplianceStatus")).toEqual([
      "pending",
      "in_progress",
      "complete",
      "exported",
    ]);
  });

  it("AuditAction enum", () => {
    expect(extractEnumValues(enumsSource, "AuditAction")).toEqual([
      "create",
      "update",
      "delete",
      "export",
      "sync",
    ]);
  });

  it("EntityType enum", () => {
    expect(extractEnumValues(enumsSource, "EntityType")).toEqual([
      "compliance_record",
      "product",
      "export",
      "tenant",
    ]);
  });

  it("UserRole enum", () => {
    expect(extractEnumValues(enumsSource, "UserRole")).toEqual([
      "admin",
      "editor",
      "viewer",
    ]);
  });

  it("ExportFormat enum", () => {
    expect(extractEnumValues(enumsSource, "ExportFormat")).toEqual([
      "json",
      "pdf",
    ]);
  });

  it("ExportStatus enum", () => {
    expect(extractEnumValues(enumsSource, "ExportStatus")).toEqual([
      "queued",
      "processing",
      "completed",
      "failed",
    ]);
  });
});
