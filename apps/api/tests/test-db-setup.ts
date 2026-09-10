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
execSync(`bunx prisma generate --schema="${SCHEMA}"`, {
	cwd: ROOT,
	stdio: "inherit",
});
execSync(`bunx prisma db push --schema="${SCHEMA}" --accept-data-loss`, {
	cwd: ROOT,
	stdio: "inherit",
	env: {
		...process.env,
		DATABASE_URL: "file::memory:?mode=memory&cache=shared",
	},
});
