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

import apiClient from "@/src/shared/lib/axios";

import { dashboardService } from "./dashboard.service";

const mockGet = vi.mocked(apiClient.get);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("dashboardService", () => {
	describe("getUser", () => {
		it("calls get with /auth/me", async () => {
			const response = {
				data: { success: true, data: { user: { id: 1, email: "a@b.com" } } },
			};
			mockGet.mockResolvedValue(response);

			const result = await dashboardService.getUser();

			expect(mockGet).toHaveBeenCalledWith("/auth/me");
			expect(result).toEqual(response.data);
		});
	});
});
