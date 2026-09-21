import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack ignores the stray package-lock.json in the home directory.
  turbopack: { root: path.resolve(".") },
};

export default nextConfig;
