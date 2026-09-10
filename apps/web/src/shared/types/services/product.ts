// ── Product Types ───────────────────────────────────────────

export interface ProductResponse {
	id: number;
	productName: string;
	productImage: string | null;
	isPromotion: boolean;
	price: number;
	ingredients: string[];
	createdAt: string;
}

export interface FindAllProductsParams {
	page?: number;
	limit?: number;
	search?: string;
	isPromotion?: boolean;
}

export interface PaginatedProducts {
	products: ProductResponse[];
	total: number;
	page: number;
	limit: number;
}

export interface CreateProductDTO {
	productName: string;
	isPromotion: boolean;
	price: number;
	ingredients: string[];
}

export interface UpdateProductDTO {
	productName?: string;
	isPromotion?: boolean;
	price?: number;
	ingredients?: string[];
}
