import type { Request, Response, NextFunction } from "express";
import { UserRepository } from "../infrastructure/repositories/user.repository.js";
import { PasswordService } from "../infrastructure/services/password.service.js";
import { JWTService } from "../infrastructure/services/jwt.service.js";
import { AuthService } from "../infrastructure/services/auth.service.js";
import type { TokenPayload } from "../domain/entities/user.entity.js";

// ── Dependency Injection Container ────────────────────────────
// Singleton instances for middleware

const userRepository = new UserRepository();
const passwordService = new PasswordService();
const jwtService = new JWTService();

export const authService = new AuthService(
  userRepository,
  passwordService,
  jwtService
);

// ── Extend Express Request ───────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// ── Authentication Middleware ─────────────────────────────────
// Verifies JWT token and attaches user to request

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = await authService.verifyAccessToken(token);

    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ── Authorization Middleware ──────────────────────────────────
// Checks if user has required role(s)

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
};

// ── Role-based Middleware Shortcuts ───────────────────────────

export const requireSuperAdmin = authorize("super-admin");
export const requireAdmin = authorize("super-admin", "admin");
export const requireAuth = authenticate;
