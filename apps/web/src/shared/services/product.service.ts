import { apiClient } from "@/src/shared/lib/axios";

import type { ApiResponse } from "../types/services/api-response";
import type {
	CreateProductDTO,
	FindAllProductsParams,
	PaginatedProducts,
	ProductResponse,
	UpdateProductDTO,
} from "../types/services/product";

// ── Product Service ─────────────────────────────────────────
// CRUD completo. Endpoints de imagen usan multipart/form-data;
// el resto usa JSON.

export const productsService = {
	// ── Read ────────────────────────────────────────────────

	async getAll(
		params?: FindAllProductsParams,
	): Promise<ApiResponse<PaginatedProducts>> {
		const { data } = await apiClient.get<ApiResponse<PaginatedProducts>>(
			"/products",
			{ params },
		);
		return data;
	},

	async getById(
		id: number,
	): Promise<ApiResponse<{ product: ProductResponse }>> {
		const { data } = await apiClient.get<
			ApiResponse<{ product: ProductResponse }>
		>(`/products/${id}`);
		return data;
	},

	// ── Create ──────────────────────────────────────────────

	/**
	 * Crear un producto individual con imagen (multipart/form-data).
	 */
	async create(
		dto: CreateProductDTO,
		imageFile: File,
	): Promise<ApiResponse<{ product: ProductResponse }>> {
		const formData = new FormData();
		formData.append("productImage", imageFile);
		formData.append("productName", dto.productName);
		formData.append("isPromotion", String(dto.isPromotion));
		formData.append("price", String(dto.price));
		formData.append("ingredients", JSON.stringify(dto.ingredients));

		const { data } = await apiClient.post<
			ApiResponse<{ product: ProductResponse }>
		>("/products", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return data;
	},

	/**
	 * Crear múltiples productos con imágenes (multipart/form-data).
	 * FormData fields: "products" (JSON string), "productImages" (files).
	 */
	async createMany(
		formData: FormData,
	): Promise<ApiResponse<{ products: ProductResponse[]; count: number }>> {
		const { data } = await apiClient.post<
			ApiResponse<{ products: ProductResponse[]; count: number }>
		>("/products/bulk", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return data;
	},

	// ── Update ──────────────────────────────────────────────

	/**
	 * Actualizar un producto. Si se pasa imageFile, reemplaza la imagen.
	 */
	async update(
		id: number,
		dto: UpdateProductDTO,
		imageFile?: File,
	): Promise<ApiResponse<{ product: ProductResponse }>> {
		if (imageFile) {
			const formData = new FormData();
			formData.append("productImage", imageFile);
			if (dto.productName !== undefined)
				formData.append("productName", dto.productName);
			if (dto.isPromotion !== undefined)
				formData.append("isPromotion", String(dto.isPromotion));
			if (dto.price !== undefined) formData.append("price", String(dto.price));
			if (dto.ingredients !== undefined)
				formData.append("ingredients", JSON.stringify(dto.ingredients));

			const { data } = await apiClient.put<
				ApiResponse<{ product: ProductResponse }>
			>(`/products/${id}`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return data;
		}

		const { data } = await apiClient.put<
			ApiResponse<{ product: ProductResponse }>
		>(`/products/${id}`, dto);
		return data;
	},

	// ── Delete ──────────────────────────────────────────────

	async delete(id: number): Promise<ApiResponse<{ message: string }>> {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/products/${id}`,
		);
		return data;
	},

	async deleteMany(ids: number[]): Promise<ApiResponse<{ message: string }>> {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			"/products/bulk",
			{ data: { ids } },
		);
		return data;
	},
};
