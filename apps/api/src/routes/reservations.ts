import { type Router as ExpressRouter, Router } from "express";

// ── Reservations Router ──────────────────────────────────────
// Note: Reservations not in current schema. Placeholder for future.

const router: ExpressRouter = Router();

// GET /api/reservations - List all reservations
router.get("/", (_req, res) => {
	res.json({
		success: true,
		data: { reservations: [] },
	});
});

export { router as reservationsRouter };
