import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll } from "vitest";

export const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
	// Ensure roles exist
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

afterAll(async () => {
	await prisma.$disconnect();
});
