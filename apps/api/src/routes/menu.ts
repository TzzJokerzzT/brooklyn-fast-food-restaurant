import { type Router as ExpressRouter, Router } from "express";

import { prisma } from "../lib/prisma.js";

export const menuRouter: ExpressRouter = Router();

// Get all categories with items
menuRouter.get("/", async (_req, res) => {
	try {
		const categories = await prisma.category.findMany({
			where: { isActive: true },
			include: {
				items: {
					where: { isAvailable: true },
					orderBy: { sortOrder: "asc" },
				},
			},
			orderBy: { sortOrder: "asc" },
		});
		res.json(categories);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch menu" });
	}
});

// Get single menu item
menuRouter.get("/items/:id", async (req, res) => {
	try {
		const item = await prisma.menuItem.findUnique({
			where: { id: req.params.id },
			include: { category: true },
		});
		if (!item) {
			return res.status(404).json({ error: "Item not found" });
		}
		res.json(item);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch item" });
	}
});
