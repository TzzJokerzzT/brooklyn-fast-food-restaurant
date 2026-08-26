import { Router, type Router as ExpressRouter } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate, registerSchema, loginSchema, refreshTokenSchema } from "../../middleware/validation.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";

// ── Auth Routes ──────────────────────────────────────────────
// /api/v1/auth/*

export const authRouter: ExpressRouter = Router();

// Public routes
authRouter.post("/register", validate(registerSchema), AuthController.register);
authRouter.post("/login", validate(loginSchema), AuthController.login);
authRouter.post("/refresh", validate(refreshTokenSchema), AuthController.refreshToken);

// Protected routes
authRouter.get("/me", authenticate, AuthController.me);
