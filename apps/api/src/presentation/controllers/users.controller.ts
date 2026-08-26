import type { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/user.repository.js";
import { PasswordService } from "../../infrastructure/services/password.service.js";
import { toUserResponse } from "../../domain/entities/user.entity.js";
import { UserRole } from "../../domain/entities/user.entity.js";

// ── Users Controller ─────────────────────────────────────────
// Handles user management requests (admin/super-admin only)

const userRepository = new UserRepository();
const passwordService = new PasswordService();

export class UsersController {
  // ── GET /users ──────────────────────────────────────────────
  // List all users (admin+)
  static async index(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const role = req.query.role as string | undefined;
      const search = req.query.search as string | undefined;

      const { users, total } = await userRepository.findAll({
        page,
        limit,
        role,
        search,
      });

      res.json({
        users: users.map(toUserResponse),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  // ── GET /users/:id ─────────────────────────────────────────
  // Get user by ID (admin+)
  static async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };

      const user = await userRepository.findById(id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ user: toUserResponse(user) });
    } catch {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  // ── POST /users ─────────────────────────────────────────────
  // Create user (super-admin only)
  static async store(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, password, role } = req.body;

      // Check if email exists
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: "Email already registered" });
        return;
      }

      // Hash password
      const hashedPassword = await passwordService.hash(password);

      // Create user
      const user = await userRepository.create({
        email,
        name,
        password: hashedPassword,
        role: role || UserRole.CLIENTS,
      });

      res.status(201).json({
        message: "User created successfully",
        user: toUserResponse(user),
      });
    } catch {
      res.status(500).json({ error: "Failed to create user" });
    }
  }

  // ── PUT /users/:id ─────────────────────────────────────────
  // Update user (super-admin can update role, admin can update name/email)
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const { name, email, role, isActive } = req.body;
      const currentUser = req.user;

      // Check if user exists
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Only super-admin can change roles
      if (role && currentUser?.role !== UserRole.SUPER_ADMIN) {
        res.status(403).json({ error: "Only super-admin can change user roles" });
        return;
      }

      // Only super-admin can deactivate users
      if (isActive !== undefined && currentUser?.role !== UserRole.SUPER_ADMIN) {
        res.status(403).json({ error: "Only super-admin can activate/deactivate users" });
        return;
      }

      // Check if email is taken by another user
      if (email && email !== existingUser.email) {
        const emailTaken = await userRepository.findByEmail(email);
        if (emailTaken) {
          res.status(409).json({ error: "Email already in use" });
          return;
        }
      }

      // Update user
      const updatedUser = await userRepository.update(id, {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
      });

      res.json({
        message: "User updated successfully",
        user: toUserResponse(updatedUser),
      });
    } catch {
      res.status(500).json({ error: "Failed to update user" });
    }
  }

  // ── DELETE /users/:id ───────────────────────────────────────
  // Delete user (super-admin only)
  static async destroy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };

      // Check if user exists
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Prevent deleting yourself
      if (req.user?.userId === id) {
        res.status(400).json({ error: "Cannot delete your own account" });
        return;
      }

      await userRepository.delete(id);

      res.json({ message: "User deleted successfully" });
    } catch {
      res.status(500).json({ error: "Failed to delete user" });
    }
  }

  // ── PATCH /users/:id/role ──────────────────────────────────
  // Change user role (super-admin only)
  static async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const { role } = req.body;

      // Check if user exists
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Prevent changing your own role
      if (req.user?.userId === id) {
        res.status(400).json({ error: "Cannot change your own role" });
        return;
      }

      // Update role
      const updatedUser = await userRepository.update(id, { role });

      res.json({
        message: "User role updated successfully",
        user: toUserResponse(updatedUser),
      });
    } catch {
      res.status(500).json({ error: "Failed to update user role" });
    }
  }

  // ── PATCH /users/:id/status ────────────────────────────────
  // Activate/deactivate user (super-admin only)
  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const { isActive } = req.body;

      // Check if user exists
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Prevent deactivating yourself
      if (req.user?.userId === id && !isActive) {
        res.status(400).json({ error: "Cannot deactivate your own account" });
        return;
      }

      // Update status
      const updatedUser = await userRepository.update(id, { isActive });

      res.json({
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        user: toUserResponse(updatedUser),
      });
    } catch {
      res.status(500).json({ error: "Failed to update user status" });
    }
  }
}
