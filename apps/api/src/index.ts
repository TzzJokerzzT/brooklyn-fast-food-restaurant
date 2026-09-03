import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import { env } from "@/lib/env.js";
import { authRouter } from "@/presentation/routes/auth.routes.js";
import { productsRouter } from "@/presentation/routes/products.routes.js";
import { usersRouter } from "@/presentation/routes/users.routes.js";

import path from "node:path";
import { fileURLToPath } from "node:url";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

// ── Swagger ──────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerDocument = YAML.load(path.join(__dirname, "..", "swagger.yaml"));

// ── Express Server ───────────────────────────────────────────

const app: Express = express();

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Swagger UI ───────────────────────────────────────────────
app.use(
	"/api/docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument, {
		customCss: ".swagger-ui .topbar { display: none }",
		customSiteTitle: "Brooklyn Fast Food — API Docs",
	}),
);

// ── API Routes (with versioning) ─────────────────────────────
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);

// ── Legacy routes (without v1 prefix) ────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);

// ── Health Check ─────────────────────────────────────────────
app.get("/health", (_req, res) => {
	res.json({
		status: "ok",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

// ── 404 Handler ──────────────────────────────────────────────
app.use((_req, res) => {
	res.status(404).json({ success: false, message: "Not found" });
});

// ── Error Handler ────────────────────────────────────────────
app.use(
	(
		_err: Error,
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction,
	) => {
		res.status(500).json({ success: false, message: "Internal server error" });
	},
);

// ── Start Server ─────────────────────────────────────────────
const PORT = env.PORT;

app.listen(PORT, () => {});

export default app;
