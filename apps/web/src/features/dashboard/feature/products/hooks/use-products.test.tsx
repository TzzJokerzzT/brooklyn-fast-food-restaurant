import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// --- mocks ---

vi.mock("@/src/shared/services/product.service", () => ({
	productsService: {
		getAll: vi.fn(),
		getById: vi.fn(),
		create: vi.fn(),
		createMany: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		deleteMany: vi.fn(),
	},
}));

vi.mock("@/src/shared/services/query-helpers", () => ({
	handleApiResponse: vi.fn((res: unknown) => res),
}));

vi.mock("@/src/shared/components/Toast", () => ({
	showToast: vi.fn(),
}));

// --- helpers ---

import { productsService } from "@/src/shared/services/product.service";
import { handleApiResponse } from "@/src/shared/services/query-helpers";

import {
	useCreateProduct,
	useDeleteProduct,
	useProduct,
	useProducts,
} from "./use-products";

function createTestQueryClient() {
	return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function wrapper({ children }: { children: ReactNode }) {
	const qc = createTestQueryClient();
	return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

// --- tests ---

beforeEach(() => {
	vi.clearAllMocks();
});

describe("useProducts", () => {
	it("calls getAll and returns data", async () => {
		const mockData = { products: [{ id: 1, name: "Burger" }] };
		vi.mocked(productsService.getAll).mockResolvedValue(mockData as never);
		vi.mocked(handleApiResponse).mockReturnValue(mockData);

		const { result } = renderHook(() => useProducts(), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(productsService.getAll).toHaveBeenCalledOnce();
		expect(result.current.data).toEqual(mockData);
	});
});

describe("useProduct", () => {
	it("calls getById when id > 0", async () => {
		const mockProduct = { id: 1, name: "Burger" };
		vi.mocked(productsService.getById).mockResolvedValue({
			product: mockProduct,
		} as never);
		vi.mocked(handleApiResponse).mockReturnValue({ product: mockProduct });

		const { result } = renderHook(() => useProduct(1), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(productsService.getById).toHaveBeenCalledWith(1);
		expect(result.current.data).toEqual(mockProduct);
	});

	it("does not call getById when id <= 0", () => {
		vi.mocked(productsService.getById).mockResolvedValue({
			product: null,
		} as never);

		const { result } = renderHook(() => useProduct(0), { wrapper });

		expect(result.current.isPending).toBe(true);
		expect(productsService.getById).not.toHaveBeenCalled();
	});
});

describe("useCreateProduct", () => {
	it("calls create and invalidates products list", async () => {
		const mockData = { product: { id: 2, name: "Fries" } };
		vi.mocked(productsService.create).mockResolvedValue(mockData as never);
		vi.mocked(handleApiResponse).mockReturnValue(mockData);

		const mockDto = { name: "Fries", price: 5 } as never;
		const mockFile = new File(["dummy"], "image.png", { type: "image/png" });

		const { result } = renderHook(() => useCreateProduct(), { wrapper });

		await act(async () => {
			await result.current.mutateAsync({ dto: mockDto, imageFile: mockFile });
		});

		expect(productsService.create).toHaveBeenCalledWith(mockDto, mockFile);
	});
});

describe("useDeleteProduct", () => {
	it("calls delete", async () => {
		const mockData = { message: "deleted" };
		vi.mocked(productsService.delete).mockResolvedValue(mockData as never);
		vi.mocked(handleApiResponse).mockReturnValue(mockData);

		const { result } = renderHook(() => useDeleteProduct(), { wrapper });

		await act(async () => {
			await result.current.mutateAsync(1);
		});

		expect(productsService.delete).toHaveBeenCalledWith(1);
	});
});
