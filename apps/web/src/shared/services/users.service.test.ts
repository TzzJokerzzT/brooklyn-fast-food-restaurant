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

import { usersService } from "./users.service";

const mockGet = vi.mocked(apiClient.get);
const mockPost = vi.mocked(apiClient.post);
const mockPut = vi.mocked(apiClient.put);
const mockPatch = vi.mocked(apiClient.patch);
const mockDelete = vi.mocked(apiClient.delete);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("usersService", () => {
	describe("create", () => {
		it("calls post with /users and dto", async () => {
			const dto = {
				userName: "John",
				lastName: "Doe",
				email: "j@d.com",
				password: "pass",
			};
			const response = { data: { success: true, data: { user: { id: 1 } } } };
			mockPost.mockResolvedValue(response);

			const result = await usersService.create(dto);

			expect(mockPost).toHaveBeenCalledWith("/users", dto);
			expect(result).toEqual(response.data);
		});
	});

	describe("getAll", () => {
		it("calls get with /users and params", async () => {
			const params = { page: 1, limit: 10 };
			const response = {
				data: { success: true, data: { users: [], total: 0 } },
			};
			mockGet.mockResolvedValue(response);

			const result = await usersService.getAll(params);

			expect(mockGet).toHaveBeenCalledWith("/users", { params });
			expect(result).toEqual(response.data);
		});

		it("works without params", async () => {
			const response = {
				data: { success: true, data: { users: [], total: 0 } },
			};
			mockGet.mockResolvedValue(response);

			await usersService.getAll();

			expect(mockGet).toHaveBeenCalledWith("/users", { params: undefined });
		});
	});

	describe("getById", () => {
		it("calls get with /users/:id", async () => {
			const response = { data: { success: true, data: { user: { id: 1 } } } };
			mockGet.mockResolvedValue(response);

			const result = await usersService.getById(1);

			expect(mockGet).toHaveBeenCalledWith("/users/1");
			expect(result).toEqual(response.data);
		});
	});

	describe("update", () => {
		it("calls put with /users/:id and dto", async () => {
			const dto = { userName: "Jane" };
			const response = { data: { success: true, data: { user: { id: 1 } } } };
			mockPut.mockResolvedValue(response);

			const result = await usersService.update(1, dto);

			expect(mockPut).toHaveBeenCalledWith("/users/1", dto);
			expect(result).toEqual(response.data);
		});
	});

	describe("updateRole", () => {
		it("calls patch with /users/:id/role and { roleId }", async () => {
			const response = { data: { success: true, data: { user: { id: 1 } } } };
			mockPatch.mockResolvedValue(response);

			const result = await usersService.updateRole(1, 3);

			expect(mockPatch).toHaveBeenCalledWith("/users/1/role", { roleId: 3 });
			expect(result).toEqual(response.data);
		});
	});

	describe("updateStatus", () => {
		it("calls patch with /users/:id/status and { isActive }", async () => {
			const response = { data: { success: true, data: { user: { id: 1 } } } };
			mockPatch.mockResolvedValue(response);

			const result = await usersService.updateStatus(1, false);

			expect(mockPatch).toHaveBeenCalledWith("/users/1/status", {
				isActive: false,
			});
			expect(result).toEqual(response.data);
		});
	});

	describe("delete", () => {
		it("calls delete with /users/:id", async () => {
			const response = { data: { success: true, data: { message: "ok" } } };
			mockDelete.mockResolvedValue(response);

			const result = await usersService.delete(5);

			expect(mockDelete).toHaveBeenCalledWith("/users/5");
			expect(result).toEqual(response.data);
		});
	});
});
