import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "../../generated/prisma": resolve(__dirname, "generated/prisma"),
    },
  },
});
