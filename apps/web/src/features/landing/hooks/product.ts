import { handleApiResponse } from "@/src/shared/services";
import { productsService } from "@/src/shared/services/product.service";
import type {
	FindAllProductsParams,
	PaginatedProducts,
} from "@/src/shared/types/services/product";

import { useQuery } from "@tanstack/react-query";
import { productsKeys } from "../../dashboard/feature/products";

// ── Use Products List ───────────────────────────────────────

export function useProductsList(params?: FindAllProductsParams) {
	return useQuery({
		queryKey: productsKeys.list(params),
		queryFn: async (): Promise<PaginatedProducts> => {
			const res = await productsService.getAll(params);
			return handleApiResponse(res);
		},
	});
}
