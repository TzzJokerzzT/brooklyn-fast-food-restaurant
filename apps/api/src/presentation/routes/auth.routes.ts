import { type Router as ExpressRouter, Router } from "express";

import { UserRepository } from "@/infrastructure/repositories/user.repository";
import { AuthService } from "@/infrastructure/services/auth.service";
import { JWTService } from "@/infrastructure/services/jwt.service";
import { PasswordService } from "@/infrastructure/services/password.service";
import { authenticate } from "@/middleware/auth.middleware";
import {
	validateLogin,
	validateRegister,
} from "@/middleware/validation.middleware";
import { AuthController } from "@/presentation/controllers/auth.controller";

// ── Auth Routes ──────────────────────────────────────────────

const router: ExpressRouter = Router();

// Create dependencies
const userRepository = new UserRepository();
const passwordService = new PasswordService();
const jwtService = new JWTService();
const authService = new AuthService(
	userRepository,
	passwordService,
	jwtService,
);
const authController = new AuthController(authService, userRepository);

// Public routes
router.post("/register", validateRegister, (req, res) =>
	authController.register(req, res),
);

router.post("/login", validateLogin, (req, res) =>
	authController.login(req, res),
);

router.post("/refresh", (req, res) => authController.refresh(req, res));

// Protected routes
router.get("/me", authenticate, (req, res) => authController.me(req, res));

export { router as authRouter };
