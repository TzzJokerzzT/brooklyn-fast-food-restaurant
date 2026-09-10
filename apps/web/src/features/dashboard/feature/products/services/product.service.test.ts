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

describe("productsService (dashboard)", () => {
	describe("getAll", () => {
		it("calls get with /products and params", async () => {
			const params = { page: 2, limit: 5, search: "burger" };
			const response = {
				data: {
					success: true,
					data: { products: [], total: 0, page: 2, limit: 5 },
				},
			};
			mockGet.mockResolvedValue(response);

			const result = await productsService.getAll(params);

			expect(mockGet).toHaveBeenCalledWith("/products", { params });
			expect(result).toEqual(response.data);
		});

		it("works without params", async () => {
			const response = {
				data: {
					success: true,
					data: { products: [], total: 0, page: 1, limit: 10 },
				},
			};
			mockGet.mockResolvedValue(response);

			await productsService.getAll();

			expect(mockGet).toHaveBeenCalledWith("/products", { params: undefined });
		});
	});

	describe("getById", () => {
		it("calls get with /products/:id", async () => {
			const response = {
				data: {
					success: true,
					data: { product: { id: 3, productName: "Fries" } },
				},
			};
			mockGet.mockResolvedValue(response);

			const result = await productsService.getById(3);

			expect(mockGet).toHaveBeenCalledWith("/products/3");
			expect(result).toEqual(response.data);
		});
	});

	describe("create", () => {
		it("builds FormData and posts to /products with multipart header", async () => {
			const dto = {
				productName: "Pizza",
				isPromotion: true,
				price: 15,
				ingredients: ["cheese"],
			};
			const imageFile = new File(["fake"], "pizza.png", { type: "image/png" });
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
		it("posts FormData to /products/bulk with multipart header", async () => {
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
		it("puts JSON to /products/:id when no imageFile", async () => {
			const dto = { productName: "Updated Salad" };
			const response = {
				data: { success: true, data: { product: { id: 2 } } },
			};
			mockPut.mockResolvedValue(response);

			const result = await productsService.update(2, dto);

			expect(mockPut).toHaveBeenCalledWith("/products/2", dto);
			expect(result).toEqual(response.data);
		});

		it("puts FormData to /products/:id with multipart header when imageFile provided", async () => {
			const dto = { productName: "New Taco", price: 10 };
			const imageFile = new File(["data"], "taco.jpg", { type: "image/jpeg" });
			const response = {
				data: { success: true, data: { product: { id: 2 } } },
			};
			mockPut.mockResolvedValue(response);

			const result = await productsService.update(2, dto, imageFile);

			expect(mockPut).toHaveBeenCalledTimes(1);
			const [url, formData, config] = mockPut.mock.calls[0];
			expect(url).toBe("/products/2");
			expect(formData).toBeInstanceOf(FormData);
			expect(config).toEqual({
				headers: { "Content-Type": "multipart/form-data" },
			});
			expect(result).toEqual(response.data);
		});
	});

	describe("delete", () => {
		it("calls delete with /products/:id", async () => {
			const response = {
				data: { success: true, data: { message: "deleted" } },
			};
			mockDelete.mockResolvedValue(response);

			const result = await productsService.delete(7);

			expect(mockDelete).toHaveBeenCalledWith("/products/7");
			expect(result).toEqual(response.data);
		});
	});

	describe("deleteMany", () => {
		it("calls delete with /products/bulk and ids in data", async () => {
			const response = {
				data: { success: true, data: { message: "deleted" } },
			};
			mockDelete.mockResolvedValue(response);

			const result = await productsService.deleteMany([10, 20]);

			expect(mockDelete).toHaveBeenCalledWith("/products/bulk", {
				data: { ids: [10, 20] },
			});
			expect(result).toEqual(response.data);
		});
	});
});
