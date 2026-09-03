import type {
	CreateProductDTO,
	FindAllProductsOptions,
	Product,
	UpdateProductDTO,
} from "@/domain/entities/product.entity.js";
import type { IProductRepository } from "@/domain/interfaces/product-repository.interface.js";
import type { IProductService } from "@/domain/interfaces/product-service.interface.js";

// ── Product Service ──────────────────────────────────────────
// Handles product business logic with dependency injection

export class ProductService implements IProductService {
	constructor(private readonly productRepository: IProductRepository) {}

	// biome-ignore lint/suspicious/useAwait: Wrapping sync repository in async for interface compatibility
	async findById(id: number): Promise<Product | null> {
		return this.productRepository.findById(id);
	}

	// biome-ignore lint/suspicious/useAwait: Wrapping sync repository in async for interface compatibility
	async findAll(
		options?: FindAllProductsOptions,
	): Promise<{ products: Product[]; total: number }> {
		return this.productRepository.findAll(options);
	}

	// biome-ignore lint/suspicious/useAwait: Wrapping sync repository in async for interface compatibility
	async create(data: CreateProductDTO): Promise<Product> {
		return this.productRepository.create(data);
	}

	// biome-ignore lint/suspicious/useAwait: Wrapping sync repository in async for interface compatibility
	async createMany(data: CreateProductDTO[]): Promise<Product[]> {
		if (data.length === 0) {
			throw new Error("At least one product is required");
		}
		return this.productRepository.createMany(data);
	}

	async update(id: number, data: UpdateProductDTO): Promise<Product> {
		const existing = await this.productRepository.findById(id);
		if (!existing) {
			throw new Error("Product not found");
		}
		return this.productRepository.update(id, data);
	}

	async delete(id: number): Promise<void> {
		const existing = await this.productRepository.findById(id);
		if (!existing) {
			throw new Error("Product not found");
		}
		return this.productRepository.delete(id);
	}

	// biome-ignore lint/suspicious/useAwait: Wrapping sync repository in async for interface compatibility
	async deleteMany(ids: number[]): Promise<void> {
		if (ids.length === 0) {
			throw new Error("At least one product ID is required");
		}
		return this.productRepository.deleteMany(ids);
	}
}
