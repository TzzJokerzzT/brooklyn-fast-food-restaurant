import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// --- mocks ---

vi.mock("@/src/shared/services/product.service", () => ({
	productsService: {
		getAll: vi.fn(),
	},
}));

vi.mock("@/src/shared/services", () => ({
	handleApiResponse: vi.fn((res: unknown) => res),
}));

vi.mock("../../dashboard/feature/products", () => ({
	productsKeys: {
		list: (params?: unknown) => ["products", "list", params] as const,
	},
}));

// --- helpers ---

import { handleApiResponse } from "@/src/shared/services";
import { productsService } from "@/src/shared/services/product.service";

import { useProductsList } from "./product";

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

describe("useProductsList", () => {
	it("calls getAll and returns data", async () => {
		const mockData = {
			products: [
				{ id: 1, name: "Pizza" },
				{ id: 2, name: "Pasta" },
			],
		};
		vi.mocked(productsService.getAll).mockResolvedValue(mockData as never);
		vi.mocked(handleApiResponse).mockReturnValue(mockData);

		const { result } = renderHook(() => useProductsList(), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(productsService.getAll).toHaveBeenCalledOnce();
		expect(result.current.data).toEqual(mockData);
	});

	it("passes params to getAll", async () => {
		const mockData = { products: [] };
		vi.mocked(productsService.getAll).mockResolvedValue(mockData as never);
		vi.mocked(handleApiResponse).mockReturnValue(mockData);

		const params = { category: "burgers" } as never;
		const { result } = renderHook(() => useProductsList(params), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(productsService.getAll).toHaveBeenCalledWith(params);
	});
});
