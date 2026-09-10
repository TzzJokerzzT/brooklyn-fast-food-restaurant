import { showToast } from "@/src/shared/components/Toast";
import { productsService } from "@/src/shared/services/product.service";
import { handleApiResponse } from "@/src/shared/services/query-helpers";
import type {
	CreateProductDTO,
	FindAllProductsParams,
	PaginatedProducts,
	ProductResponse,
	UpdateProductDTO,
} from "@/src/shared/types/services/product";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Query Keys ──────────────────────────────────────────────

export const productsKeys = {
	all: ["products"] as const,
	lists: () => [...productsKeys.all, "list"] as const,
	list: (params?: FindAllProductsParams) =>
		[...productsKeys.lists(), params] as const,
	details: () => [...productsKeys.all, "detail"] as const,
	detail: (id: number) => [...productsKeys.details(), id] as const,
};

// ── Use Products List ───────────────────────────────────────

export function useProducts(params?: FindAllProductsParams) {
	return useQuery({
		queryKey: productsKeys.list(params),
		queryFn: async (): Promise<PaginatedProducts> => {
			const res = await productsService.getAll(params);
			return handleApiResponse(res);
		},
	});
}

// ── Use Product Detail ──────────────────────────────────────

export function useProduct(id: number) {
	return useQuery({
		queryKey: productsKeys.detail(id),
		queryFn: async (): Promise<ProductResponse> => {
			const res = await productsService.getById(id);
			return handleApiResponse(res).product;
		},
		enabled: id > 0,
	});
}

// ── Use Create Product ──────────────────────────────────────

export function useCreateProduct() {
	const queryClient = useQueryClient();

	return useMutation<
		{ product: ProductResponse },
		Error,
		{ dto: CreateProductDTO; imageFile: File }
	>({
		mutationFn: async ({ dto, imageFile }) => {
			const res = await productsService.create(dto, imageFile);
			return handleApiResponse(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
			showToast("Producto creado exitosamente", "success");
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : "Error al crear producto";
			showToast(message, "error");
		},
	});
}

// ── Use Create Products (Bulk) ──────────────────────────────

export function useCreateProducts() {
	const queryClient = useQueryClient();

	return useMutation<
		{ products: ProductResponse[]; count: number },
		Error,
		FormData
	>({
		mutationFn: async (formData) => {
			const res = await productsService.createMany(formData);
			return handleApiResponse(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
			showToast("Productos creados exitosamente", "success");
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : "Error al crear los productos";
			showToast(message, "error");
		},
	});
}

// ── Use Update Product ──────────────────────────────────────

export function useUpdateProduct() {
	const queryClient = useQueryClient();

	return useMutation<
		{ product: ProductResponse },
		Error,
		{ id: number; dto: UpdateProductDTO; imageFile?: File }
	>({
		mutationFn: async ({ id, dto, imageFile }) => {
			const res = await productsService.update(id, dto, imageFile);
			return handleApiResponse(res);
		},
		onSuccess: (data, variables) => {
			queryClient.setQueryData(productsKeys.detail(variables.id), data.product);
			queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
			showToast("Producto actualizado exitosamente", "success");
		},
		onError: (error) => {
			const message =
				error instanceof Error
					? error.message
					: "Error al actualizar el producto";
			showToast(message, "error");
		},
	});
}

// ── Use Delete Product ──────────────────────────────────────

export function useDeleteProduct() {
	const queryClient = useQueryClient();

	return useMutation<{ message: string }, Error, number>({
		mutationFn: async (id) => {
			const res = await productsService.delete(id);
			return handleApiResponse(res);
		},
		onSuccess: (_data, id) => {
			queryClient.removeQueries({ queryKey: productsKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
			showToast("Producto eliminado exitosamente", "success");
		},
		onError: (error) => {
			const message =
				error instanceof Error
					? error.message
					: "Error al eliminar el producto";
			showToast(message, "error");
		},
	});
}

// ── Use Delete Products (Bulk) ──────────────────────────────

export function useDeleteProducts() {
	const queryClient = useQueryClient();

	return useMutation<{ message: string }, Error, number[]>({
		mutationFn: async (ids) => {
			const res = await productsService.deleteMany(ids);
			return handleApiResponse(res);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsKeys.all });
		},
	});
}
