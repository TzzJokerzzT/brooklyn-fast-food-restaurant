import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import morgan from "morgan";
import { env } from "./lib/env.js";
import { authRouter } from "./presentation/routes/auth.routes.js";
import { usersRouter } from "./presentation/routes/users.routes.js";
import { eventsRouter } from "./routes/events.js";
import { menuRouter } from "./routes/menu.js";
import { ordersRouter } from "./routes/orders.js";
import { reservationsRouter } from "./routes/reservations.js";

const app: Express = express();
const PORT = env.PORT;

// ── Global Middleware ─────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

// ── Health Check ──────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
	res.json({
		status: "ok",
		version: "1.0.0",
		timestamp: new Date().toISOString(),
	});
});

// ── API v1 Routes ────────────────────────────────────────────
const apiV1 = express.Router();

// Auth routes (public + protected)
apiV1.use("/auth", authRouter);

// User management routes (admin+)
apiV1.use("/users", usersRouter);

// Menu routes
apiV1.use("/menu", menuRouter);

// Order routes
apiV1.use("/orders", ordersRouter);

// Reservation routes
apiV1.use("/reservations", reservationsRouter);

// Event routes
apiV1.use("/events", eventsRouter);

// Mount API v1
app.use("/api/v1", apiV1);

// ── Legacy Routes (v0) ───────────────────────────────────────
// Keep old routes for backwards compatibility
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/events", eventsRouter);

// ── 404 Handler ──────────────────────────────────────────────
app.use((_req, res) => {
	res.status(404).json({
		error: "Not found",
		message: "The requested endpoint does not exist",
		documentation: "/api/health",
	});
});

// ── Error Handler ─────────────────────────────────────────────
app.use(
	(
		err: Error,
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction,
	) => {
		console.error("Unhandled error:", err.stack);

		// Don't leak error details in production
		const isProduction = env.NODE_ENV === "production";

		res.status(500).json({
			error: "Internal server error",
			...(isProduction ? {} : { details: err.message }),
		});
	},
);

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
	console.log(`
🚀 Brooklyn Restaurant API
━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Server:  http://localhost:${PORT}
📋 Health:  http://localhost:${PORT}/api/health
🔑 API v1:  http://localhost:${PORT}/api/v1
📊 Env:     ${env.NODE_ENV}
  `);
});

export default app;
