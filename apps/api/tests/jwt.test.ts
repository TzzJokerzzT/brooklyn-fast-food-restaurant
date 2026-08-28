import { beforeEach, describe, expect, it } from "vitest";
import { JWTService } from "../src/infrastructure/services/jwt.service";

// ── JWT Service Tests ────────────────────────────────────────

describe("JWTService", () => {
	let jwtService: JWTService;

	beforeEach(() => {
		jwtService = new JWTService();
	});

	describe("generateTokens", () => {
		it("should generate access and refresh tokens", () => {
			const result = jwtService.generateTokens({
				userId: 1,
				email: "test@example.com",
				roleId: 3,
			});

			expect(result).toHaveProperty("accessToken");
			expect(result).toHaveProperty("refreshToken");
			expect(typeof result.accessToken).toBe("string");
			expect(typeof result.refreshToken).toBe("string");
		});

		it("should generate different tokens for different users", () => {
			const tokens1 = jwtService.generateTokens({
				userId: 1,
				email: "user1@example.com",
				roleId: 3,
			});

			const tokens2 = jwtService.generateTokens({
				userId: 2,
				email: "user2@example.com",
				roleId: 3,
			});

			expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
		});
	});

	describe("verifyAccessToken", () => {
		it("should verify a valid access token", () => {
			const payload = { userId: 1, email: "test@example.com", roleId: 3 };
			const { accessToken } = jwtService.generateTokens(payload);

			const verified = jwtService.verifyAccessToken(accessToken);

			expect(verified.userId).toBe(1);
			expect(verified.email).toBe("test@example.com");
			expect(verified.roleId).toBe(3);
		});

		it("should throw on invalid token", () => {
			expect(() => jwtService.verifyAccessToken("invalid-token")).toThrow();
		});
	});

	describe("verifyRefreshToken", () => {
		it("should verify a valid refresh token", () => {
			const payload = { userId: 1, email: "test@example.com", roleId: 3 };
			const { refreshToken } = jwtService.generateTokens(payload);

			const verified = jwtService.verifyRefreshToken(refreshToken);

			expect(verified.userId).toBe(1);
			expect(verified.email).toBe("test@example.com");
		});

		it("should throw on invalid refresh token", () => {
			expect(() => jwtService.verifyRefreshToken("invalid-token")).toThrow();
		});

		it("should not verify access token as refresh token", () => {
			const { accessToken } = jwtService.generateTokens({
				userId: 1,
				email: "test@example.com",
				roleId: 3,
			});

			expect(() => jwtService.verifyRefreshToken(accessToken)).toThrow();
		});
	});
});
