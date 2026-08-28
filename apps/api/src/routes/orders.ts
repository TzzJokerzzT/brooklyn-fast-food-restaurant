import { type Router as ExpressRouter, Router } from "express";

import { prisma } from "@/lib/prisma.js";

// ── Orders Router ────────────────────────────────────────────

const router: ExpressRouter = Router();

// GET /api/orders - List all purchases
router.get("/", async (_req, res) => {
	try {
		const purchases = await prisma.purchase.findMany({
			include: {
				user: true,
				product: true,
			},
			orderBy: { purchaseDate: "desc" },
		});

		res.json({
			success: true,
			data: { purchases },
		});
	} catch (_error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch purchases",
		});
	}
});

// POST /api/orders - Create purchase
router.post("/", async (req, res) => {
	try {
		const { userId, productId, quantity } = req.body;

		const purchase = await prisma.purchase.create({
			data: {
				userId,
				productId,
				quantity: quantity || 1,
				purchaseDate: new Date(),
			},
			include: {
				user: true,
				product: true,
			},
		});

		res.status(201).json({
			success: true,
			data: { purchase },
		});
	} catch (_error) {
		res.status(500).json({
			success: false,
			message: "Failed to create purchase",
		});
	}
});

// GET /api/orders/user/:userId - Get user purchases
router.get("/user/:userId", async (req, res) => {
	try {
		const { userId } = req.params;

		const purchases = await prisma.purchase.findMany({
			where: { userId: Number(userId) },
			include: { product: true },
			orderBy: { purchaseDate: "desc" },
		});

		res.json({
			success: true,
			data: { purchases },
		});
	} catch (_error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch user purchases",
		});
	}
});

export { router as ordersRouter };
