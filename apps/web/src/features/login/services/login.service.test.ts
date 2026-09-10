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

import { loginService } from "./index";

const mockGet = vi.mocked(apiClient.get);
const mockPost = vi.mocked(apiClient.post);
const mockPut = vi.mocked(apiClient.put);
const mockDelete = vi.mocked(apiClient.delete);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("loginService", () => {
	describe("getAll", () => {
		it("calls get with /login and params", async () => {
			const params = { page: 1, limit: 5 };
			const response = {
				data: { success: true, data: { items: [], total: 0 } },
			};
			mockGet.mockResolvedValue(response);

			const result = await loginService.getAll(params);

			expect(mockGet).toHaveBeenCalledWith("/login", { params });
			expect(result).toEqual(response.data);
		});

		it("works without params", async () => {
			const response = {
				data: { success: true, data: { items: [], total: 0 } },
			};
			mockGet.mockResolvedValue(response);

			await loginService.getAll();

			expect(mockGet).toHaveBeenCalledWith("/login", { params: undefined });
		});
	});

	describe("getById", () => {
		it("calls get with /login/:id", async () => {
			const response = { data: { success: true, data: { item: { id: 1 } } } };
			mockGet.mockResolvedValue(response);

			const result = await loginService.getById(1);

			expect(mockGet).toHaveBeenCalledWith("/login/1");
			expect(result).toEqual(response.data);
		});
	});

	describe("create", () => {
		it("calls post with /login and dto", async () => {
			const dto = { email: "a@b.com", password: "pass" };
			const response = { data: { success: true, data: { item: { id: 1 } } } };
			mockPost.mockResolvedValue(response);

			const result = await loginService.create(dto);

			expect(mockPost).toHaveBeenCalledWith("/login", dto);
			expect(result).toEqual(response.data);
		});
	});

	describe("update", () => {
		it("calls put with /login/:id and dto", async () => {
			const dto = { email: "updated@b.com" };
			const response = { data: { success: true, data: { item: { id: 1 } } } };
			mockPut.mockResolvedValue(response);

			const result = await loginService.update(1, dto);

			expect(mockPut).toHaveBeenCalledWith("/login/1", dto);
			expect(result).toEqual(response.data);
		});
	});

	describe("delete", () => {
		it("calls delete with /login/:id", async () => {
			const response = { data: { success: true, data: { message: "ok" } } };
			mockDelete.mockResolvedValue(response);

			const result = await loginService.delete(5);

			expect(mockDelete).toHaveBeenCalledWith("/login/5");
			expect(result).toEqual(response.data);
		});
	});
});
