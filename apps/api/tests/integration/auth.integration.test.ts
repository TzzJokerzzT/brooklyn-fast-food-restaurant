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

// ── Auth Integration Tests ───────────────────────────────────
// Tests the full HTTP request/response cycle for auth endpoints.
// Uses SQLite in-memory via the shared test setup.

const API = "/api/v1/auth";

describe("Auth Integration", () => {
	const testUser = {
		userName: "Test",
		lastName: "User",
		email: `auth-integ-${Date.now()}@example.com`,
		password: "Password123",
	};

	// ── POST /auth/register ────────────────────────────────

	describe("POST /auth/register", () => {
		it("should register a new user", async () => {
			const res = await request(app).post(`${API}/register`).send(testUser);

			expect(res.status).toBe(201);
			expect(res.body.success).toBe(true);
			expect(res.body.data.user).toHaveProperty("id");
			expect(res.body.data.user.userName).toBe("Test");
			expect(res.body.data.user.email).toBe(testUser.email);
			expect(res.body.data.user).not.toHaveProperty("password");
		});

		it("should return 400 for duplicate email", async () => {
			// Register first
			await request(app).post(`${API}/register`).send(testUser);

			// Try again with same email
			const res = await request(app).post(`${API}/register`).send(testUser);

			expect(res.status).toBe(400);
			expect(res.body.success).toBe(false);
		});

		it("should return 400 for invalid email", async () => {
			const res = await request(app)
				.post(`${API}/register`)
				.send({ ...testUser, email: "not-an-email" });

			expect(res.status).toBe(400);
			expect(res.body.success).toBe(false);
			expect(res.body.errors).toBeDefined();
		});

		it("should return 400 for short password", async () => {
			const res = await request(app)
				.post(`${API}/register`)
				.send({ ...testUser, password: "123" });

			expect(res.status).toBe(400);
			expect(res.body.success).toBe(false);
		});

		it("should return 400 for missing required fields", async () => {
			const res = await request(app)
				.post(`${API}/register`)
				.send({ email: "test@example.com" });

			expect(res.status).toBe(400);
			expect(res.body.success).toBe(false);
		});
	});

	// ── POST /auth/login ───────────────────────────────────

	describe("POST /auth/login", () => {
		beforeEach(async () => {
			// Register user before each login test
			await request(app).post(`${API}/register`).send(testUser);
		});

		it("should login with valid credentials", async () => {
			const res = await request(app)
				.post(`${API}/login`)
				.send({ email: testUser.email, password: testUser.password });

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.user).toHaveProperty("id");
			expect(res.body.data.user.email).toBe(testUser.email);

			// Should set httpOnly cookies
			const cookies = res.headers["set-cookie"] as unknown as string[];
			expect(cookies).toBeDefined();
			expect(cookies.some((c) => c.includes("brooklyn_access_token"))).toBe(
				true,
			);
			expect(cookies.some((c) => c.includes("brooklyn_refresh_token"))).toBe(
				true,
			);
		});

		it("should return 401 for wrong password", async () => {
			const res = await request(app)
				.post(`${API}/login`)
				.send({ email: testUser.email, password: "WrongPassword1" });

			expect(res.status).toBe(401);
			expect(res.body.success).toBe(false);
		});

		it("should return 401 for non-existent email", async () => {
			const res = await request(app)
				.post(`${API}/login`)
				.send({ email: "nobody@example.com", password: "Password123" });

			expect(res.status).toBe(401);
			expect(res.body.success).toBe(false);
		});
	});

	// ── GET /auth/me ───────────────────────────────────────

	describe("GET /auth/me", () => {
		it("should return current user with valid token", async () => {
			// Register + login to get cookie
			await request(app).post(`${API}/register`).send(testUser);
			const loginRes = await request(app)
				.post(`${API}/login`)
				.send({ email: testUser.email, password: testUser.password });

			const cookies = loginRes.headers["set-cookie"];

			// Call /me with cookie
			const res = await request(app).get(`${API}/me`).set("Cookie", cookies);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.user.email).toBe(testUser.email);
		});

		it("should return 401 without token", async () => {
			const res = await request(app).get(`${API}/me`);

			expect(res.status).toBe(401);
			expect(res.body.success).toBe(false);
		});
	});

	// ── POST /auth/logout ──────────────────────────────────

	describe("POST /auth/logout", () => {
		it("should clear cookies", async () => {
			const res = await request(app).post(`${API}/logout`);

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);

			const cookies = res.headers["set-cookie"] as unknown as string[];
			expect(cookies).toBeDefined();
			expect(cookies.some((c) => c.includes("brooklyn_access_token=;"))).toBe(
				true,
			);
			expect(cookies.some((c) => c.includes("brooklyn_refresh_token=;"))).toBe(
				true,
			);
		});
	});

	// ── POST /auth/refresh ─────────────────────────────────

	describe("POST /auth/refresh", () => {
		it("should refresh tokens with valid refresh token", async () => {
			// Register + login
			await request(app).post(`${API}/register`).send(testUser);
			const loginRes = await request(app)
				.post(`${API}/login`)
				.send({ email: testUser.email, password: testUser.password });

			// Extract refresh token from set-cookie header
			const setCookie = loginRes.headers["set-cookie"] as unknown as string[];
			const refreshCookie = setCookie?.find((c) =>
				c.startsWith("brooklyn_refresh_token="),
			);
			const refreshToken = refreshCookie
				? refreshCookie.split(";")[0].split("=").slice(1).join("=")
				: undefined;

			// Refresh using body token (avoids cookie parsing issues)
			const res = await request(app)
				.post(`${API}/refresh`)
				.send({ refreshToken });

			expect(res.status).toBe(200);
			expect(res.body.success).toBe(true);

			// Should set new cookies
			const newCookies = res.headers["set-cookie"];
			expect(newCookies).toBeDefined();
		});

		it("should return 401 without refresh token", async () => {
			const res = await request(app).post(`${API}/refresh`);

			expect(res.status).toBe(401);
			expect(res.body.success).toBe(false);
		});
	});
});
