import type { NextFunction, Request, Response } from "express";

import type { TokenPayload } from "@/domain/entities/user.entity.js";
import { UserRepository } from "@/infrastructure/repositories/user.repository.js";
import { AuthService } from "@/infrastructure/services/auth.service.js";
import { JWTService } from "@/infrastructure/services/jwt.service.js";
import { PasswordService } from "@/infrastructure/services/password.service.js";

// ── Auth Middleware ───────────────────────────────────────────

// Create dependencies once (singleton pattern)
const userRepository = new UserRepository();
const passwordService = new PasswordService();
const jwtService = new JWTService();
const authService = new AuthService(
	userRepository,
	passwordService,
	jwtService,
);

// Extend Express Request
declare global {
	namespace Express {
		interface Request {
			user?: TokenPayload;
		}
	}
}

// Authenticate middleware - verifies JWT token
export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader?.startsWith("Bearer ")) {
			res.status(401).json({ success: false, message: "No token provided" });
			return;
		}

		const token = authHeader.split(" ")[1];

		try {
			const payload = await authService.verifyAccessToken(token);
			req.user = payload;
			next();
		} catch {
			res.status(401).json({ success: false, message: "Invalid token" });
		}
	} catch (_error) {
		res.status(500).json({ success: false, message: "Authentication error" });
	}
};

// Authorize middleware - checks user role
export const authorize = (allowedRoles: number[]) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.user) {
			res.status(401).json({ success: false, message: "Not authenticated" });
			return;
		}

		if (!allowedRoles.includes(req.user.roleId)) {
			res
				.status(403)
				.json({ success: false, message: "Insufficient permissions" });
			return;
		}

		next();
	};
};

// Require Super Admin (roleId = 1)
export const requireSuperAdmin = authorize([1]);

// Require Admin (roleId = 1 or 2)
export const requireAdmin = authorize([1, 2]);
