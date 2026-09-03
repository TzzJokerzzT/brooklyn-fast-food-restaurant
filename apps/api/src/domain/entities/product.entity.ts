// ── Product Entity ───────────────────────────────────────────
// Core business entity for products

export interface Product {
	id: number;
	productName: string;
	productImage: string | null;
	isPromotion: boolean;
	price: number;
	ingredients: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateProductDTO {
	productName: string;
	productImage?: string;
	isPromotion?: boolean;
	price: number;
	ingredients: string[];
}

export interface UpdateProductDTO {
	productName?: string;
	productImage?: string;
	isPromotion?: boolean;
	price?: number;
	ingredients?: string[];
}

export interface ProductResponse {
	id: number;
	productName: string;
	productImage: string | null;
	isPromotion: boolean;
	price: number;
	ingredients: string[];
	createdAt: Date;
}

export interface FindAllProductsOptions {
	page?: number;
	limit?: number;
	search?: string;
	isPromotion?: boolean;
}

// ── Helper Functions ─────────────────────────────────────────

export function toProductResponse(product: Product): ProductResponse {
	return {
		id: product.id,
		productName: product.productName,
		productImage: product.productImage,
		isPromotion: product.isPromotion,
		price: product.price,
		ingredients: product.ingredients,
		createdAt: product.createdAt,
	};
}
