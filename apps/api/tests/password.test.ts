import { beforeEach, describe, expect, it } from "vitest";
import { PasswordService } from "../src/infrastructure/services/password.service";

// ── Password Service Tests ───────────────────────────────────

describe("PasswordService", () => {
	let passwordService: PasswordService;

	beforeEach(() => {
		passwordService = new PasswordService();
	});

	describe("hash", () => {
		it("should hash a password", async () => {
			const hash = await passwordService.hash("Password123");

			expect(hash).not.toBe("Password123");
			expect(hash).toMatch(/^\$2[aby]?\$\d{1,2}\$/);
		});

		it("should produce different hashes for same input", async () => {
			const hash1 = await passwordService.hash("Password123");
			const hash2 = await passwordService.hash("Password123");

			expect(hash1).not.toBe(hash2);
		});
	});

	describe("compare", () => {
		it("should return true for matching password", async () => {
			const hash = await passwordService.hash("Password123");

			const result = await passwordService.compare("Password123", hash);

			expect(result).toBe(true);
		});

		it("should return false for non-matching password", async () => {
			const hash = await passwordService.hash("Password123");

			const result = await passwordService.compare("WrongPassword", hash);

			expect(result).toBe(false);
		});

		it("should handle empty password", async () => {
			const hash = await passwordService.hash("");

			const result = await passwordService.compare("", hash);

			expect(result).toBe(true);
		});
	});
});
