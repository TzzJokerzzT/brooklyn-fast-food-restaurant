import type { Request, Response } from "express";

import { toUserResponse } from "@/domain/entities/user.entity.js";
import type { IAuthService } from "@/domain/interfaces/auth-service.interface.js";
import type { UserRepository } from "@/infrastructure/repositories/user.repository.js";

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

			res.status(200).json({
				success: true,
				data: {
					user: user ? toUserResponse(user) : null,
					...tokens,
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
			const { refreshToken } = req.body;

			const tokens = await this.authService.refreshToken(refreshToken);

			res.status(200).json({
				success: true,
				data: tokens,
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
}
