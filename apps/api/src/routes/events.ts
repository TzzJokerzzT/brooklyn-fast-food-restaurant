import { type Router as ExpressRouter, Router } from "express";

import { prisma } from "@/lib/prisma.js";

// ── Events Router ────────────────────────────────────────────

const router: ExpressRouter = Router();

// GET /api/events - List all events
router.get("/", async (_req, res) => {
	try {
		const events = await prisma.event.findMany({
			orderBy: { eventDateFrom: "asc" },
		});

		res.json({
			success: true,
			data: { events },
		});
	} catch (_error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch events",
		});
	}
});

// GET /api/events/:id - Get single event
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const event = await prisma.event.findUnique({
			where: { id: Number(id) },
		});

		if (!event) {
			res.status(404).json({
				success: false,
				message: "Event not found",
			});
			return;
		}

		res.json({
			success: true,
			data: { event },
		});
	} catch (_error) {
		res.status(500).json({
			success: false,
			message: "Failed to fetch event",
		});
	}
});

// POST /api/events - Create event
router.post("/", async (req, res) => {
	try {
		const { eventName, description, eventImage, eventDateFrom, eventDateTo } =
			req.body;

		const event = await prisma.event.create({
			data: {
				eventName,
				description,
				eventImage,
				eventDateFrom: new Date(eventDateFrom),
				eventDateTo: new Date(eventDateTo),
			},
		});

		res.status(201).json({
			success: true,
			data: { event },
		});
	} catch (_error) {
		res.status(500).json({
			success: false,
			message: "Failed to create event",
		});
	}
});

export { router as eventsRouter };
