import type { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/user.repository.js";
import { PasswordService } from "../../infrastructure/services/password.service.js";
import { JWTService } from "../../infrastructure/services/jwt.service.js";
import { AuthService } from "../../infrastructure/services/auth.service.js";
import { toUserResponse } from "../../domain/entities/user.entity.js";

// ── Auth Controller ──────────────────────────────────────────
// Handles authentication requests

// Initialize dependencies
const userRepository = new UserRepository();
const passwordService = new PasswordService();
const jwtService = new JWTService();
const authService = new AuthService(userRepository, passwordService, jwtService);

export class AuthController {
  // ── POST /auth/register ─────────────────────────────────────
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { userName, lastName, email, password, address } = req.body;

      const tokens = await authService.register({
        userName,
        lastName,
        email,
        password,
        address,
      });

      res.status(201).json({
        message: "User registered successfully",
        ...tokens,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Email already registered") {
        res.status(409).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Failed to register user" });
    }
  }

  // ── POST /auth/login ────────────────────────────────────────
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const tokens = await authService.login({ email, password });

      res.json({
        message: "Login successful",
        ...tokens,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid credentials") {
        res.status(401).json({ error: error.message });
        return;
      }
      if (error instanceof Error && error.message === "Account is deactivated") {
        res.status(403).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Failed to login" });
    }
  }

  // ── POST /auth/refresh ──────────────────────────────────────
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const tokens = await authService.refreshToken(refreshToken);

      res.json({
        message: "Token refreshed successfully",
        ...tokens,
      });
    } catch {
      res.status(401).json({ error: "Invalid refresh token" });
    }
  }

  // ── GET /auth/me ────────────────────────────────────────────
  static async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const user = await userRepository.findById(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({
        user: toUserResponse(user),
      });
    } catch {
      res.status(500).json({ error: "Failed to get user" });
    }
  }
}
