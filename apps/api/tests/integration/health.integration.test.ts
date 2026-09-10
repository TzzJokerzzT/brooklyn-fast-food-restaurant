import request from "supertest";
import { describe, expect, it } from "vitest";

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

// ── Health Endpoint Integration Tests ────────────────────────

describe("Health Endpoint", () => {
	it("should return 200 with status ok", async () => {
		const res = await request(app).get("/health");

		expect(res.status).toBe(200);
		expect(res.body.status).toBe("ok");
		expect(res.body).toHaveProperty("timestamp");
		expect(res.body).toHaveProperty("uptime");
	});

	it("should return ISO timestamp", async () => {
		const res = await request(app).get("/health");

		expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
	});

	it("should return numeric uptime", async () => {
		const res = await request(app).get("/health");

		expect(typeof res.body.uptime).toBe("number");
		expect(res.body.uptime).toBeGreaterThanOrEqual(0);
	});
});

describe("404 Handler", () => {
	it("should return 404 for unknown routes", async () => {
		const res = await request(app).get("/api/v1/unknown-endpoint");

		expect(res.status).toBe(404);
		expect(res.body.success).toBe(false);
		expect(res.body.message).toBe("Not found");
	});
});
