import type { Request, Response } from "express";

import { toProductResponse } from "@/domain/entities/product.entity.js";
import type { IProductService } from "@/domain/interfaces/product-service.interface.js";
import { cloudinaryService } from "@/infrastructure/services/cloudinary.service.js";

// ── Products Controller ──────────────────────────────────────
// Handles HTTP requests for product management

export class ProductsController {
	constructor(private readonly productService: IProductService) {}

	async getAll(req: Request, res: Response): Promise<void> {
		try {
			const { page = 1, limit = 10, search, isPromotion } = req.query;

			const result = await this.productService.findAll({
				page: Number(page),
				limit: Number(limit),
				search: search as string,
				isPromotion:
					isPromotion !== undefined ? isPromotion === "true" : undefined,
			});

			res.status(200).json({
				success: true,
				data: {
					products: result.products.map(toProductResponse),
					total: result.total,
					page: Number(page),
					limit: Number(limit),
				},
				message: "Products retrieved successfully",
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to fetch products";
			res.status(500).json({ success: false, message });
		}
	}

	async getById(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;

			const product = await this.productService.findById(Number(id));

			if (!product) {
				res.status(404).json({ success: false, message: "Product not found" });
				return;
			}

			res.status(200).json({
				success: true,
				data: { product: toProductResponse(product) },
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to fetch product";
			res.status(500).json({ success: false, message });
		}
	}

	async create(req: Request, res: Response): Promise<void> {
		try {
			const { productName, isPromotion, price, ingredients } = req.body;

			let productImageUrl: string | undefined;

			if (req.file) {
				const uploadResult = await cloudinaryService.uploadImage(req.file);
				productImageUrl = uploadResult.url;
			}

			const product = await this.productService.create({
				productName,
				productImage: productImageUrl,
				isPromotion,
				price,
				ingredients,
			});

			res.status(201).json({
				success: true,
				data: { product: toProductResponse(product) },
				message: "Product created successfully",
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to create product";
			res.status(400).json({ success: false, message });
		}
	}

	async createMany(req: Request, res: Response): Promise<void> {
		try {
			// Parse products from FormData (sent as JSON string in "products" field)
			let productsData: Array<{
				productName: string;
				isPromotion?: boolean;
				price: number;
				ingredients: string[];
			}>;

			try {
				const raw = req.body.products;
				productsData = typeof raw === "string" ? JSON.parse(raw) : raw;
			} catch {
				res.status(400).json({
					success: false,
					message: "Invalid products data format",
				});
				return;
			}

			if (!Array.isArray(productsData) || productsData.length === 0) {
				res.status(400).json({
					success: false,
					message: "Products array is required and must not be empty",
				});
				return;
			}

			// Handle image uploads (files indexed by fieldname: productImages0, productImages1, ...)
			const files = req.files as Express.Multer.File[] | undefined;
			const imageMap = new Map<number, Express.Multer.File>();

			if (files && files.length > 0) {
				for (const file of files) {
					// Multer array uploads use fieldname "productImages" for all
					// We parse index from originalname: "0_product.jpg", "1_product.jpg"
					const match = file.originalname.match(/^(\d+)_/);
					if (match) {
						imageMap.set(Number(match[1]), file);
					}
				}
			}

			// Upload images and build DTOs
			const dtos = await Promise.all(
				productsData.map(async (item, index) => {
					let productImageUrl: string | undefined;

					const file = imageMap.get(index);
					if (file) {
						const uploadResult =
							await cloudinaryService.uploadImage(file);
						productImageUrl = uploadResult.url;
					}

					return {
						productName: item.productName,
						productImage: productImageUrl,
						isPromotion: item.isPromotion ?? false,
						price: item.price,
						ingredients: item.ingredients,
					};
				}),
			);

			const createdProducts = await this.productService.createMany(dtos);

			res.status(201).json({
				success: true,
				data: {
					products: createdProducts.map(toProductResponse),
					count: createdProducts.length,
				},
				message: `${createdProducts.length} products created successfully`,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to create products";
			res.status(400).json({ success: false, message });
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const { productName, isPromotion, price, ingredients } = req.body;

			const existing = await this.productService.findById(Number(id));
			if (!existing) {
				res.status(404).json({ success: false, message: "Product not found" });
				return;
			}

			let productImageUrl = existing.productImage ?? undefined;

			if (req.file) {
				// Delete old image if exists
				if (existing.productImage) {
					const publicId = cloudinaryService.getPublicIdFromUrl(
						existing.productImage,
					);
					if (publicId) {
						await cloudinaryService.deleteImage(publicId);
					}
				}

				// Upload new image
				const uploadResult = await cloudinaryService.uploadImage(req.file);
				productImageUrl = uploadResult.url;
			}

			const product = await this.productService.update(Number(id), {
				productName,
				productImage: productImageUrl,
				isPromotion,
				price,
				ingredients,
			});

			res.status(200).json({
				success: true,
				data: { product: toProductResponse(product) },
				message: "Product updated successfully",
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to update product";
			res.status(400).json({ success: false, message });
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;

			const existing = await this.productService.findById(Number(id));
			if (!existing) {
				res.status(404).json({ success: false, message: "Product not found" });
				return;
			}

			// Delete image from Cloudinary if exists
			if (existing.productImage) {
				const publicId = cloudinaryService.getPublicIdFromUrl(
					existing.productImage,
				);
				if (publicId) {
					await cloudinaryService.deleteImage(publicId);
				}
			}

			await this.productService.delete(Number(id));

			res.status(200).json({
				success: true,
				message: "Product deleted successfully",
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to delete product";
			res.status(500).json({ success: false, message });
		}
	}

	async deleteMany(req: Request, res: Response): Promise<void> {
		try {
			const { ids } = req.body;

			if (!Array.isArray(ids) || ids.length === 0) {
				res.status(400).json({
					success: false,
					message: "IDs array is required and must not be empty",
				});
				return;
			}

			await this.productService.deleteMany(ids);

			res.status(200).json({
				success: true,
				message: `${ids.length} products deleted successfully`,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to delete products";
			res.status(500).json({ success: false, message });
		}
	}
}
