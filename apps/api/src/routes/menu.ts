import { type Router as ExpressRouter, Router } from "express";

import { prisma } from "@/lib/prisma.js";

// ── Menu Router ──────────────────────────────────────────────

const router: ExpressRouter = Router();

// GET /api/menu - List all menu items with products
router.get("/", async (_req, res) => {
	try {
		const products = await prisma.product.findMany({
			orderBy: { productName: "asc" },
		});

		res.json({
			success: true,
			data: { products },
		});
	} catch (_error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch menu",
		});
	}
});

// GET /api/menu/:id - Get single product
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const product = await prisma.product.findUnique({
			where: { id: Number(id) },
		});

		if (!product) {
			res.status(404).json({
				success: false,
				message: "Product not found",
			});
			return;
		}

		res.json({
			success: true,
			data: { product },
		});
	} catch (_error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch product",
		});
	}
});

// GET /api/menu/promotions - Get promotional items
router.get("/promotions", async (_req, res) => {
	try {
		const products = await prisma.product.findMany({
			where: { isPromotion: true },
			orderBy: { productName: "asc" },
		});

		res.json({
			success: true,
			data: { products },
		});
	} catch (_error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch promotions",
		});
	}
});

export { router as menuRouter };
