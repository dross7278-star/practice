import path from "node:path";
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    // Read directly rather than via Prisma's env() so `prisma generate` still
    // runs during builds where DATABASE_URL is not exposed.
    url: process.env.DATABASE_URL ?? "",
  },
  migrations: {
    path: path.join("prisma", "migrations"),
  },
});
