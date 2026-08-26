import { type Router as ExpressRouter, Router } from "express";

import { prisma } from "../lib/prisma.js";

export const reservationsRouter: ExpressRouter = Router();

// Create reservation
reservationsRouter.post("/", async (req, res) => {
	try {
		const { userId, date, time, guests, notes } = req.body;

		const reservation = await prisma.reservation.create({
			data: {
				userId,
				date: new Date(date),
				time,
				guests,
				notes,
			},
		});

		res.status(201).json(reservation);
	} catch (error) {
		res.status(500).json({ error: "Failed to create reservation" });
	}
});

// Get user reservations
reservationsRouter.get("/user/:userId", async (req, res) => {
	try {
		const reservations = await prisma.reservation.findMany({
			where: { userId: req.params.userId },
			orderBy: { date: "desc" },
		});
		res.json(reservations);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch reservations" });
	}
});

// Cancel reservation
reservationsRouter.patch("/:id/cancel", async (req, res) => {
	try {
		const reservation = await prisma.reservation.update({
			where: { id: req.params.id },
			data: { status: "cancelled" },
		});
		res.json(reservation);
	} catch (error) {
		res.status(500).json({ error: "Failed to cancel reservation" });
	}
});
