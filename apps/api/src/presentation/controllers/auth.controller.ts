import type { Request, Response } from "express";

import { toUserResponse } from "@/domain/entities/user.entity.js";
import type { IAuthService } from "@/domain/interfaces/auth-service.interface.js";
import type { UserRepository } from "@/infrastructure/repositories/user.repository.js";

// ── Cookie Config ────────────────────────────────────────────
// httpOnly cookies for XSS protection.
// SameSite=Lax works for same-site cross-port requests (localhost).

const isProduction = process.env.NODE_ENV === "production";

const ACCESS_COOKIE_OPTIONS = {
	httpOnly: true as const,
	secure: isProduction,
	sameSite: "lax" as const,
	maxAge: 15 * 60 * 1000, // 15 min
	path: "/",
};

const REFRESH_COOKIE_OPTIONS = {
	httpOnly: true as const,
	secure: isProduction,
	sameSite: "lax" as const,
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	path: "/",
};

// ── Auth Controller ──────────────────────────────────────────
// Handles HTTP requests for authentication

export class AuthController {
	constructor(
		private readonly authService: IAuthService,
		private readonly userRepository: UserRepository,
	) {}

	async register(req: Request, res: Response): Promise<void> {
		try {
			const { userName, lastName, email, password, address, phoneNumber } =
				req.body;

			const user = await this.authService.register({
				userName,
				lastName,
				email,
				password,
				address,
				phoneNumber,
			});

			res.status(201).json({
				success: true,
				data: {
					user: toUserResponse(user),
				},
				message: "User register success",
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Registration failed";
			res.status(400).json({ success: false, message });
		}
	}

	async login(req: Request, res: Response): Promise<void> {
		try {
			const { email, password } = req.body;

			const tokens = await this.authService.login({ email, password });

			const user = await this.userRepository.findByEmail(email);

			// Set httpOnly cookies — tokens never exposed to JavaScript
			res.cookie(
				"brooklyn_access_token",
				tokens.accessToken,
				ACCESS_COOKIE_OPTIONS,
			);
			res.cookie(
				"brooklyn_refresh_token",
				tokens.refreshToken,
				REFRESH_COOKIE_OPTIONS,
			);

			res.status(200).json({
				success: true,
				data: {
					user: user ? toUserResponse(user) : null,
				},
				message: "User login success",
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : "Login failed";
			res.status(401).json({ success: false, message });
		}
	}

	async refresh(req: Request, res: Response): Promise<void> {
		try {
			// Read from cookie first, then body (backward compat)
			const refreshToken =
				req.cookies?.brooklyn_refresh_token || req.body.refreshToken;

			if (!refreshToken) {
				res
					.status(401)
					.json({ success: false, message: "No refresh token provided" });
				return;
			}

			const tokens = await this.authService.refreshToken(refreshToken);

			// Set new httpOnly cookies
			res.cookie(
				"brooklyn_access_token",
				tokens.accessToken,
				ACCESS_COOKIE_OPTIONS,
			);
			res.cookie(
				"brooklyn_refresh_token",
				tokens.refreshToken,
				REFRESH_COOKIE_OPTIONS,
			);

			// Tokens are in httpOnly cookies — nothing to return in body
			res.status(200).json({
				success: true,
				data: {},
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : "Refresh failed";
			res.status(401).json({ success: false, message });
		}
	}

	async me(req: Request, res: Response): Promise<void> {
		try {
			if (!req.user) {
				res.status(401).json({ success: false, message: "Not authenticated" });
				return;
			}
			const user = await this.userRepository.findById(req.user.userId);

			if (!user) {
				res.status(404).json({ success: false, message: "User not found" });
				return;
			}

			res.status(200).json({
				success: true,
				data: { user: toUserResponse(user) },
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to get user";
			res.status(500).json({ success: false, message });
		}
	}

	// biome-ignore lint/suspicious/useAwait: Express route handler must be async for interface compatibility
	async logout(_req: Request, res: Response): Promise<void> {
		res.clearCookie("brooklyn_access_token", { path: "/" });
		res.clearCookie("brooklyn_refresh_token", { path: "/" });
		res.status(200).json({ success: true, message: "Logged out" });
	}
}
