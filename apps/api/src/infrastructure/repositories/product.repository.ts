import type {
	CreateProductDTO,
	FindAllProductsOptions,
	Product,
	UpdateProductDTO,
} from "@/domain/entities/product.entity.js";
import type { IProductRepository } from "@/domain/interfaces/product-repository.interface.js";
import { prisma } from "@/lib/prisma.js";

import type { Product as PrismaProduct } from "@prisma/client";

// ── Prisma Product Repository ────────────────────────────────
// Implements IProductRepository using Prisma ORM

function mapPrismaProduct(product: PrismaProduct): Product {
	return {
		id: product.id,
		productName: product.productName,
		productImage: product.productImage,
		isPromotion: product.isPromotion,
		price: product.price,
		ingredients: product.ingredients,
		createdAt: product.createdAt,
		updatedAt: product.updatedAt,
	};
}

export class ProductRepository implements IProductRepository {
	async findById(id: number): Promise<Product | null> {
		const product = await prisma.product.findUnique({ where: { id } });
		return product ? mapPrismaProduct(product) : null;
	}

	async findAll(
		options: FindAllProductsOptions = {},
	): Promise<{ products: Product[]; total: number }> {
		const { page = 1, limit = 10, search, isPromotion } = options;

		const where = {
			...(search && {
				productName: { contains: search },
			}),
			...(isPromotion !== undefined && { isPromotion }),
		};

		const [products, total] = await Promise.all([
			prisma.product.findMany({
				where,
				skip: (page - 1) * limit,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			prisma.product.count({ where }),
		]);

		return { products: products.map(mapPrismaProduct), total };
	}

	async create(data: CreateProductDTO): Promise<Product> {
		const product = await prisma.product.create({
			data: {
				productName: data.productName,
				productImage: data.productImage,
				isPromotion: data.isPromotion ?? false,
				price: data.price,
				ingredients: data.ingredients,
			},
		});
		return mapPrismaProduct(product);
	}

	async createMany(data: CreateProductDTO[]): Promise<Product[]> {
		const products = await prisma.product.createManyAndReturn({
			data: data.map((item) => ({
				productName: item.productName,
				productImage: item.productImage,
				isPromotion: item.isPromotion ?? false,
				price: item.price,
				ingredients: item.ingredients,
			})),
		});
		return products.map(mapPrismaProduct);
	}

	async update(id: number, data: UpdateProductDTO): Promise<Product> {
		const product = await prisma.product.update({
			where: { id },
			data,
		});
		return mapPrismaProduct(product);
	}

	async delete(id: number): Promise<void> {
		await prisma.product.delete({ where: { id } });
	}

	async deleteMany(ids: number[]): Promise<void> {
		await prisma.product.deleteMany({ where: { id: { in: ids } } });
	}
}
