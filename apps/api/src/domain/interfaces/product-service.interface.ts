import type {
	CreateProductDTO,
	FindAllProductsOptions,
	Product,
	UpdateProductDTO,
} from "../entities/product.entity.js";

// ── Product Service Interface ────────────────────────────────
// Abstract contract for product operations

export interface IProductService {
	findById(id: number): Promise<Product | null>;
	findAll(
		options?: FindAllProductsOptions,
	): Promise<{ products: Product[]; total: number }>;
	create(data: CreateProductDTO): Promise<Product>;
	createMany(data: CreateProductDTO[]): Promise<Product[]>;
	update(id: number, data: UpdateProductDTO): Promise<Product>;
	delete(id: number): Promise<void>;
	deleteMany(ids: number[]): Promise<void>;
}
