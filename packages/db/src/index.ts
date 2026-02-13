import { PrismaClient } from "../generated/prisma";

export * from "../generated/prisma";

let prisma: PrismaClient;

declare const globalThis: {
  prismaGlobal: PrismaClient | undefined;
} & typeof global;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // Prevent multiple instances during hot-reload in development
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = new PrismaClient();
  }
  prisma = globalThis.prismaGlobal;
}

export { prisma };
