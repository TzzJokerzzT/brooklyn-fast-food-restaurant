#!/usr/bin/env node
// ── Test DB Setup ───────────────────────────────────────────
// Generates Prisma client from schema.test.prisma (SQLite)
// and pushes the schema. Run before `vitest`.

import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCHEMA = resolve(ROOT, "prisma/schema.test.prisma");

console.log("🧪 Setting up test database (SQLite in-memory)...\n");

// Generate Prisma client from test schema
console.log("  → Generating Prisma client from schema.test.prisma...");
execSync(`bunx prisma generate --schema="${SCHEMA}"`, {
	cwd: ROOT,
	stdio: "inherit",
});

// Push schema to SQLite (creates tables)
console.log("  → Pushing schema to SQLite...");
execSync(`bunx prisma db push --schema="${SCHEMA}" --accept-data-loss`, {
	cwd: ROOT,
	stdio: "inherit",
	env: {
		...process.env,
		DATABASE_URL: "file::memory:?mode=memory&cache=shared",
	},
});

console.log("\n✅ Test database ready.\n");
