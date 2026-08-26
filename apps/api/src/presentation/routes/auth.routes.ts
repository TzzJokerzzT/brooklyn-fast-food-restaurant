import { type Router as ExpressRouter, Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import {
	loginSchema,
	refreshTokenSchema,
	registerSchema,
	validate,
} from "../../middleware/validation.middleware.js";
import { AuthController } from "../controllers/auth.controller.js";

// ── Auth Routes ──────────────────────────────────────────────
// /api/v1/auth/*

export const authRouter: ExpressRouter = Router();

// Public routes
authRouter.post("/register", validate(registerSchema), AuthController.register);
authRouter.post("/login", validate(loginSchema), AuthController.login);
authRouter.post(
	"/refresh",
	validate(refreshTokenSchema),
	AuthController.refreshToken,
);

// Protected routes
authRouter.get("/me", authenticate, AuthController.me);
