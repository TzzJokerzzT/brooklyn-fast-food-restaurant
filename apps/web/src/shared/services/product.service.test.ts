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

import { productsService } from "./product.service";

const mockGet = vi.mocked(apiClient.get);
const mockPost = vi.mocked(apiClient.post);
const mockPut = vi.mocked(apiClient.put);
const mockDelete = vi.mocked(apiClient.delete);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("productsService", () => {
	describe("getAll", () => {
		it("calls get with /products and params", async () => {
			const params = { page: 1, limit: 10 };
			const response = {
				data: { success: true, data: { products: [], total: 0 } },
			};
			mockGet.mockResolvedValue(response);

			const result = await productsService.getAll(params);

			expect(mockGet).toHaveBeenCalledWith("/products", { params });
			expect(result).toEqual(response.data);
		});

		it("works without params", async () => {
			const response = {
				data: { success: true, data: { products: [], total: 0 } },
			};
			mockGet.mockResolvedValue(response);

			await productsService.getAll();

			expect(mockGet).toHaveBeenCalledWith("/products", { params: undefined });
		});
	});

	describe("getById", () => {
		it("calls get with /products/:id", async () => {
			const response = {
				data: { success: true, data: { product: { id: 1 } } },
			};
			mockGet.mockResolvedValue(response);

			const result = await productsService.getById(1);

			expect(mockGet).toHaveBeenCalledWith("/products/1");
			expect(result).toEqual(response.data);
		});
	});

	describe("create", () => {
		it("builds FormData and calls post with multipart header", async () => {
			const dto = {
				productName: "Burger",
				isPromotion: false,
				price: 12,
				ingredients: ["beef"],
			};
			const imageFile = new File(["bytes"], "burger.png", {
				type: "image/png",
			});
			const response = {
				data: { success: true, data: { product: { id: 1 } } },
			};
			mockPost.mockResolvedValue(response);

			const result = await productsService.create(dto, imageFile);

			expect(mockPost).toHaveBeenCalledTimes(1);
			const [url, formData, config] = mockPost.mock.calls[0];
			expect(url).toBe("/products");
			expect(formData).toBeInstanceOf(FormData);
			expect(config).toEqual({
				headers: { "Content-Type": "multipart/form-data" },
			});
			expect(result).toEqual(response.data);
		});
	});

	describe("createMany", () => {
		it("calls post with /products/bulk and multipart header", async () => {
			const formData = new FormData();
			const response = {
				data: { success: true, data: { products: [], count: 0 } },
			};
			mockPost.mockResolvedValue(response);

			const result = await productsService.createMany(formData);

			expect(mockPost).toHaveBeenCalledWith("/products/bulk", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			expect(result).toEqual(response.data);
		});
	});

	describe("update", () => {
		it("calls put with JSON when no imageFile", async () => {
			const dto = { productName: "Updated" };
			const response = {
				data: { success: true, data: { product: { id: 1 } } },
			};
			mockPut.mockResolvedValue(response);

			const result = await productsService.update(1, dto);

			expect(mockPut).toHaveBeenCalledWith("/products/1", dto);
			expect(result).toEqual(response.data);
		});

		it("calls put with FormData and multipart header when imageFile is provided", async () => {
			const dto = { productName: "Updated", price: 20 };
			const imageFile = new File(["bytes"], "new.png", { type: "image/png" });
			const response = {
				data: { success: true, data: { product: { id: 1 } } },
			};
			mockPut.mockResolvedValue(response);

			const result = await productsService.update(1, dto, imageFile);

			expect(mockPut).toHaveBeenCalledTimes(1);
			const [url, formData, config] = mockPut.mock.calls[0];
			expect(url).toBe("/products/1");
			expect(formData).toBeInstanceOf(FormData);
			expect(config).toEqual({
				headers: { "Content-Type": "multipart/form-data" },
			});
			expect(result).toEqual(response.data);
		});
	});

	describe("delete", () => {
		it("calls delete with /products/:id", async () => {
			const response = { data: { success: true, data: { message: "ok" } } };
			mockDelete.mockResolvedValue(response);

			const result = await productsService.delete(5);

			expect(mockDelete).toHaveBeenCalledWith("/products/5");
			expect(result).toEqual(response.data);
		});
	});

	describe("deleteMany", () => {
		it("calls delete with /products/bulk and ids in data", async () => {
			const response = { data: { success: true, data: { message: "ok" } } };
			mockDelete.mockResolvedValue(response);

			const result = await productsService.deleteMany([1, 2, 3]);

			expect(mockDelete).toHaveBeenCalledWith("/products/bulk", {
				data: { ids: [1, 2, 3] },
			});
			expect(result).toEqual(response.data);
		});
	});
});
