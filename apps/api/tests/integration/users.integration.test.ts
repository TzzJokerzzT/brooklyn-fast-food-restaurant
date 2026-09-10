import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

// ── Set test env BEFORE importing app ────────────────────────
process.env.DATABASE_URL = "file::memory:?mode=memory&cache=shared";
process.env.NODE_ENV = "test";
process.env.JWT_ACCESS_SECRET =
	"test-access-secret-key-for-integration-tests-32ch";
process.env.JWT_REFRESH_SECRET =
	"test-refresh-secret-key-for-integration-tests-32c";
process.env.CLOUDINARY_CLOUD_NAME = "test";
process.env.CLOUDINARY_API_KEY = "test";
process.env.CLOUDINARY_API_SECRET = "test";

import app from "../../src/app.js";
import { env } from "../../src/lib/env.js";
import { prisma } from "../setup.js";

// ── Users Integration Tests ──────────────────────────────────
// Tests the full HTTP request/response cycle for user endpoints.
// Requires authentication + role-based authorization.

const API = "/api/v1/users";

// Helper: sign a JWT access token directly (avoids cookie parsing issues).
// Uses env.JWT_ACCESS_SECRET from the env module (loaded by dotenv from .env),
// which is the same secret the auth middleware uses for verification.
function signAccessToken(
	userId: number,
	email: string,
	roleId: number,
): string {
	return jwt.sign({ userId, email, roleId }, env.JWT_ACCESS_SECRET, {
		expiresIn: "1h",
	});
}

describe("Users Integration", () => {
	const adminEmail = `admin-users-${Date.now()}@example.com`;
	const adminPassword = "AdminPass123";
	let adminToken: string;
	let adminUserId: number;

	beforeEach(async () => {
		// Create admin user directly in DB (avoids double-register issues)
		const bcrypt = await import("bcrypt");
		const hashedPassword = await bcrypt.hash(adminPassword, 10);

		// Upsert so it's idempotent across beforeEach calls
		const admin = await prisma.user.upsert({
			where: { email: adminEmail },
			create: {
				userName: "Admin",
				lastName: "User",
				email: adminEmail,
				password: hashedPassword,
				roleId: 1, // super-admin
			},
			update: {
				roleId: 1,
				isActive: true,
			},
		});

		adminUserId = admin.id;
		// Sign token directly — no cookie parsing needed
		adminToken = signAccessToken(adminUserId, adminEmail, 1);
	});

	// ── GET /users ─────────────────────────────────────────

	describe("GET /users", () => {
		it("should return paginated users", async () => {
			const res = await request(app)
				.get(`${API}?page=1&limit=10`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.users).toBeInstanceOf(Array);
			expect(res.body.data.total).toBeGreaterThanOrEqual(1);
			expect(res.body.data.page).toBe(1);
		});

		it("should return 401 without auth", async () => {
			const res = await request(app).get(API);

			expect(res.status).toBe(401);
			expect(res.body.success).toBe(false);
		});
	});

	// ── GET /users/:id ────────────────────────────────────

	describe("GET /users/:id", () => {
		it("should return user by id", async () => {
			// Create a known user to fetch
			const createRes = await request(app)
				.post(API)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({
					userName: "Fetch",
					lastName: "Me",
					email: `fetch-me-${Date.now()}@example.com`,
					password: "Password123",
					roleId: 3,
				});

			expect(createRes.status).toBe(201);
			const userId = createRes.body.data.user.id;

			const res = await request(app)
				.get(`${API}/${userId}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.user.id).toBe(userId);
		});

		it("should return 404 for non-existent user", async () => {
			const res = await request(app)
				.get(`${API}/99999`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(404);
			expect(res.body.success).toBe(false);
		});
	});

	// ── POST /users (create) ──────────────────────────────

	describe("POST /users", () => {
		it("should create a new user", async () => {
			const res = await request(app)
				.post(API)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({
					userName: "New",
					lastName: "User",
					email: `new-user-${Date.now()}@example.com`,
					password: "Password123",
					roleId: 3,
				});

			expect(res.status).toBe(201);
			expect(res.body.success).toBe(true);
			expect(res.body.data.user).toHaveProperty("id");
		});
	});

	// ── PUT /users/:id (update) ───────────────────────────

	describe("PUT /users/:id", () => {
		it("should update user fields", async () => {
			// Create a user to update
			const createRes = await request(app)
				.post(API)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({
					userName: "ToUpdate",
					lastName: "User",
					email: `to-update-${Date.now()}@example.com`,
					password: "Password123",
					roleId: 3,
				});

			expect(createRes.status).toBe(201);
			const userId = createRes.body.data.user.id;

			const res = await request(app)
				.put(`${API}/${userId}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ userName: "Updated" });

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.user.userName).toBe("Updated");
		});
	});

	// ── PATCH /users/:id/role ─────────────────────────────

	describe("PATCH /users/:id/role", () => {
		it("should update user role", async () => {
			// Create a user to update
			const createRes = await request(app)
				.post(API)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({
					userName: "Role",
					lastName: "Test",
					email: `role-test-${Date.now()}@example.com`,
					password: "Password123",
					roleId: 3,
				});

			expect(createRes.status).toBe(201);
			const userId = createRes.body.data.user.id;

			const res = await request(app)
				.patch(`${API}/${userId}/role`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ roleId: 2 });

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			// toUserResponse returns role: { id, name } — check role.id
			expect(res.body.data.user.role.id).toBe(2);
		});
	});

	// ── PATCH /users/:id/status ───────────────────────────

	describe("PATCH /users/:id/status", () => {
		it("should toggle user status", async () => {
			// Create a user
			const createRes = await request(app)
				.post(API)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({
					userName: "Status",
					lastName: "Test",
					email: `status-test-${Date.now()}@example.com`,
					password: "Password123",
					roleId: 3,
				});

			expect(createRes.status).toBe(201);
			const userId = createRes.body.data.user.id;

			const res = await request(app)
				.patch(`${API}/${userId}/status`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ isActive: false });

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.user.isActive).toBe(false);
		});
	});

	// ── DELETE /users/:id ─────────────────────────────────

	describe("DELETE /users/:id", () => {
		it("should delete user", async () => {
			// Create a user
			const createRes = await request(app)
				.post(API)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({
					userName: "Delete",
					lastName: "Me",
					email: `delete-me-${Date.now()}@example.com`,
					password: "Password123",
					roleId: 3,
				});

			expect(createRes.status).toBe(201);
			const userId = createRes.body.data.user.id;

			const res = await request(app)
				.delete(`${API}/${userId}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);

			// Verify deleted
			const getRes = await request(app)
				.get(`${API}/${userId}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(getRes.status).toBe(404);
		});
	});

	// ── Authorization ─────────────────────────────────────

	describe("Authorization", () => {
		it("should return 403 for non-admin user", async () => {
			// Create a regular client user
			const clientEmail = `client-${Date.now()}@example.com`;
			const bcrypt = await import("bcrypt");
			const hashedPassword = await bcrypt.hash("ClientPass123", 10);

			const clientUser = await prisma.user.create({
				data: {
					userName: "Client",
					lastName: "User",
					email: clientEmail,
					password: hashedPassword,
					roleId: 3, // clients
				},
			});

			const clientToken = signAccessToken(clientUser.id, clientEmail, 3);

			const res = await request(app)
				.get(API)
				.set("Authorization", `Bearer ${clientToken}`);

			expect(res.status).toBe(403);
			expect(res.body.success).toBe(false);
		});
	});
});
