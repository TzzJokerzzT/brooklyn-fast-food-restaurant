import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, beforeEach } from "vitest";

// ── Test Database Setup ──────────────────────────────────────
// Uses SQLite in-memory for complete test isolation.
// Each test run starts with a fresh, empty database.
// No data leaks between runs — the DB dies with the process.

// Force SQLite for tests (overrides .env DATABASE_URL).
// mode=memory&cache=shared ensures ALL PrismaClient instances
// (test setup + repository singletons) share the same in-memory DB.
const TEST_DB_URL = "file::memory:?mode=memory&cache=shared";
process.env.DATABASE_URL = TEST_DB_URL;
process.env.NODE_ENV = "test";

// Create a dedicated Prisma client for tests
export const prisma = new PrismaClient({
	datasources: {
		db: { url: TEST_DB_URL },
	},
});

beforeAll(async () => {
	// Push schema to SQLite (creates tables)
	// This uses schema.test.prisma which is SQLite-compatible
	await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "roles" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name" TEXT NOT NULL UNIQUE
    )
  `);

	await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "user_name" TEXT NOT NULL,
      "last_name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "address" TEXT,
      "phone_number" TEXT,
      "is_active" BOOLEAN NOT NULL DEFAULT true,
      "last_login_at" DATETIME,
      "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "role_id" INTEGER NOT NULL,
      FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )
  `);

	await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "products" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "product_name" TEXT NOT NULL,
      "product_image" TEXT,
      "is_promotion" BOOLEAN NOT NULL DEFAULT false,
      "price" REAL NOT NULL,
      "ingredients" TEXT NOT NULL DEFAULT '[]',
      "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

	await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "purchases" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "quantity" INTEGER NOT NULL DEFAULT 1,
      "purchase_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "user_id" INTEGER NOT NULL,
      "product_id" INTEGER NOT NULL,
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )
  `);

	await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "events" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "event_name" TEXT NOT NULL,
      "description" TEXT,
      "event_image" TEXT,
      "event_date_from" DATETIME NOT NULL,
      "event_date_to" DATETIME NOT NULL
    )
  `);

	// Seed default roles
	await prisma.role.upsert({
		where: { id: 1 },
		update: {},
		create: { id: 1, name: "super-admin" },
	});
	await prisma.role.upsert({
		where: { id: 2 },
		update: {},
		create: { id: 2, name: "admin" },
	});
	await prisma.role.upsert({
		where: { id: 3 },
		update: {},
		create: { id: 3, name: "clients" },
	});
});

// Clean up all test data between tests
beforeEach(async () => {
	// Delete in reverse dependency order (FK constraints)
	await prisma.purchase.deleteMany();
	await prisma.user.deleteMany();
	// Roles stay — they're seeded once and shared
});

afterAll(async () => {
	await prisma.$disconnect();
});
