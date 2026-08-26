import type { Request, Response } from "express";

import { toUserResponse } from "@/domain/entities/user.entity.js";
import { UserRepository } from "@/infrastructure/repositories/user.repository.js";
import { PasswordService } from "@/infrastructure/services/password.service.js";

// ── Users Controller ─────────────────────────────────────────
// Handles HTTP requests for user management (admin operations)

export class UsersController {
	private readonly userRepository: UserRepository;
	private readonly passwordService: PasswordService;

	constructor() {
		this.userRepository = new UserRepository();
		this.passwordService = new PasswordService();
	}

	async getAll(req: Request, res: Response): Promise<void> {
		try {
			const { page = 1, limit = 10, roleId, search } = req.query;

			const result = await this.userRepository.findAll({
				page: Number(page),
				limit: Number(limit),
				roleId: roleId ? Number(roleId) : undefined,
				search: search as string,
			});

			res.status(200).json({
				success: true,
				data: {
					users: result.users.map(toUserResponse),
					total: result.total,
					page: Number(page),
					limit: Number(limit),
				},
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to fetch users";
			res.status(500).json({ success: false, message });
		}
	}

	async getById(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;

			const user = await this.userRepository.findById(Number(id));

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
				error instanceof Error ? error.message : "Failed to fetch user";
			res.status(500).json({ success: false, message });
		}
	}

	async create(req: Request, res: Response): Promise<void> {
		try {
			const { userName, lastName, email, password, address, roleId } = req.body;

			const existingUser = await this.userRepository.findByEmail(email);
			if (existingUser) {
				res
					.status(400)
					.json({ success: false, message: "Email already registered" });
				return;
			}

			const hashedPassword = await this.passwordService.hash(password);

			const user = await this.userRepository.create({
				userName,
				lastName,
				email,
				password: hashedPassword,
				address,
				roleId,
			});

			res.status(201).json({
				success: true,
				data: { user: toUserResponse(user) },
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to create user";
			res.status(400).json({ success: false, message });
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const { userName, lastName, email, address, roleId } = req.body;

			const user = await this.userRepository.findById(Number(id));
			if (!user) {
				res.status(404).json({ success: false, message: "User not found" });
				return;
			}

			const updatedUser = await this.userRepository.update(Number(id), {
				userName,
				lastName,
				email,
				address,
				roleId,
			});

			res.status(200).json({
				success: true,
				data: { user: toUserResponse(updatedUser) },
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to update user";
			res.status(400).json({ success: false, message });
		}
	}

	async updateRole(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const { roleId } = req.body;

			const user = await this.userRepository.findById(Number(id));
			if (!user) {
				res.status(404).json({ success: false, message: "User not found" });
				return;
			}

			const updatedUser = await this.userRepository.update(Number(id), {
				roleId,
			});

			res.status(200).json({
				success: true,
				data: { user: toUserResponse(updatedUser) },
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to update role";
			res.status(400).json({ success: false, message });
		}
	}

	async updateStatus(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const { isActive } = req.body;

			const user = await this.userRepository.findById(Number(id));
			if (!user) {
				res.status(404).json({ success: false, message: "User not found" });
				return;
			}

			const updatedUser = await this.userRepository.update(Number(id), {
				isActive,
			});

			res.status(200).json({
				success: true,
				data: { user: toUserResponse(updatedUser) },
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to update status";
			res.status(400).json({ success: false, message });
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;

			const user = await this.userRepository.findById(Number(id));
			if (!user) {
				res.status(404).json({ success: false, message: "User not found" });
				return;
			}

			await this.userRepository.delete(Number(id));

			res.status(200).json({
				success: true,
				message: "User deleted successfully",
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to delete user";
			res.status(500).json({ success: false, message });
		}
	}
}
