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

import { registerService } from "./register.service";

const mockPost = vi.mocked(apiClient.post);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("registerService", () => {
	describe("register", () => {
		it("calls post with /auth/register and the dto", async () => {
			const dto = {
				userName: "John",
				lastName: "Doe",
				email: "j@d.com",
				password: "pass123",
				phoneNumber: "123",
			};
			const response = { data: { success: true, data: { user: { id: 1 } } } };
			mockPost.mockResolvedValue(response);

			const result = await registerService.register(dto);

			expect(mockPost).toHaveBeenCalledWith("/auth/register", dto);
			expect(result).toEqual(response.data);
		});
	});
});
