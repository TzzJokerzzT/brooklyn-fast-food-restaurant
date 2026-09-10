import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// In tests, use the DATABASE_URL set by tests/setup.ts (SQLite in-memory).
// In development/production, use the URL from .env (PostgreSQL).
export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		datasources: process.env.DATABASE_URL
			? { db: { url: process.env.DATABASE_URL } }
			: undefined,
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
