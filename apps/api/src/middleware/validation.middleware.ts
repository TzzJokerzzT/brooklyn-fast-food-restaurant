import type { Request, Response, NextFunction } from "express";
import { z, type ZodSchema } from "zod";

// ── Validation Middleware ─────────────────────────────────────
// Generic middleware that validates request body against Zod schema

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
};

// ── Validation Schemas ───────────────────────────────────────

export const registerSchema = z.object({
  userName: z.string().min(2, "User name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase, one uppercase, and one number"
    ),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  userName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  role: z.enum(["super-admin", "admin", "clients"]).optional(),
  isActive: z.boolean().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  role: z.string().optional(),
  search: z.string().optional(),
});
