import { type Router as ExpressRouter, Router } from "express";

import { prisma } from "../lib/prisma.js";

export const ordersRouter: ExpressRouter = Router();

// Create order
ordersRouter.post("/", async (req, res) => {
	try {
		const { userId, items, notes, tableNumber } = req.body;

		const order = await prisma.order.create({
			data: {
				userId,
				notes,
				tableNumber,
				total: 0, // Will be calculated
				items: {
					create: items.map(
						(item: {
							menuItemId: string;
							quantity: number;
							price: number;
						}) => ({
							menuItemId: item.menuItemId,
							quantity: item.quantity,
							price: item.price,
						}),
					),
				},
			},
			include: { items: true },
		});

		// Calculate total
		const total = order.items.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
		await prisma.order.update({
			where: { id: order.id },
			data: { total },
		});

		res.status(201).json({ ...order, total });
	} catch (error) {
		res.status(500).json({ error: "Failed to create order" });
	}
});

// Get user orders
ordersRouter.get("/user/:userId", async (req, res) => {
	try {
		const orders = await prisma.order.findMany({
			where: { userId: req.params.userId },
			include: { items: { include: { menuItem: true } } },
			orderBy: { createdAt: "desc" },
		});
		res.json(orders);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch orders" });
	}
});

// Update order status
ordersRouter.patch("/:id/status", async (req, res) => {
	try {
		const { status } = req.body;
		const order = await prisma.order.update({
			where: { id: req.params.id },
			data: { status },
		});
		res.json(order);
	} catch (error) {
		res.status(500).json({ error: "Failed to update order" });
	}
});
