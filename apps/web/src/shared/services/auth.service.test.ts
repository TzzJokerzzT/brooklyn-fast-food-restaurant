import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/shared/lib/axios", () => ({
	apiClient: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
	default: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}));

import { apiClient } from "@/src/shared/lib/axios";

import { authService } from "./auth.service";

const mockPost = vi.mocked(apiClient.post);
const mockGet = vi.mocked(apiClient.get);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("authService", () => {
	describe("login", () => {
		it("calls post with /auth/login and the dto", async () => {
			const dto = { email: "a@b.com", password: "secret" };
			const response = { data: { success: true, data: { user: { id: 1 } } } };
			mockPost.mockResolvedValue(response);

			const result = await authService.login(dto);

			expect(mockPost).toHaveBeenCalledWith("/auth/login", dto);
			expect(result).toEqual(response.data);
		});
	});

	describe("me", () => {
		it("calls get with /auth/me", async () => {
			const response = { data: { success: true, data: { user: { id: 1 } } } };
			mockGet.mockResolvedValue(response);

			const result = await authService.me();

			expect(mockGet).toHaveBeenCalledWith("/auth/me");
			expect(result).toEqual(response.data);
		});
	});

	describe("logout", () => {
		it("calls post with /auth/logout", async () => {
			mockPost.mockResolvedValue({});

			await authService.logout();

			expect(mockPost).toHaveBeenCalledWith("/auth/logout");
		});

		it("swallows errors without throwing", async () => {
			mockPost.mockRejectedValue(new Error("network"));

			await expect(authService.logout()).resolves.toBeUndefined();
		});
	});
});
