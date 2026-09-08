import type { NextFunction, Request, Response } from "express";

import { z } from "zod";

// ── Validation Schemas ───────────────────────────────────────

const registerSchema = z.object({
	userName: z.string().min(2, "Name must be at least 2 characters"),
	lastName: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Invalid email format"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[0-9]/, "Password must contain at least one number"),
	address: z.string().optional(),
	phoneNumber: z.string().optional(),
});

const loginSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(1, "Password is required"),
});

const updateUserSchema = z.object({
	userName: z.string().min(2).optional(),
	lastName: z.string().min(2).optional(),
	email: z.string().email().optional(),
	address: z.string().optional(),
	roleId: z.number().int().min(1).max(3).optional(),
});

const createProductSchema = z.object({
	productName: z.string().min(1, "Product name is required"),
	isPromotion: z.coerce.boolean().optional().default(false),
	price: z.coerce.number().positive("Price must be positive"),
	ingredients: z
		.string()
		.transform((val) => {
			try {
				const parsed = JSON.parse(val);
				return Array.isArray(parsed) ? parsed : [val];
			} catch {
				// Si no es JSON válido, tratar como string separado por comas
				return val
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
			}
		})
		.pipe(z.array(z.string()).min(1, "At least one ingredient is required")),
});

const updateProductSchema = z.object({
	productName: z.string().min(1).optional(),
	isPromotion: z.coerce.boolean().optional(),
	price: z.coerce.number().positive().optional(),
	ingredients: z
		.string()
		.transform((val) => {
			try {
				const parsed = JSON.parse(val);
				return Array.isArray(parsed) ? parsed : [val];
			} catch {
				return val
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
			}
		})
		.pipe(z.array(z.string()).optional()),
});

// ── Validation Middleware ─────────────────────────────────────

function validate(schema: z.ZodSchema) {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const errors = result.error.errors.map((err) => ({
				field: err.path.join("."),
				message: err.message,
			}));

			res.status(400).json({
				success: false,
				message: "Validation error",
				errors,
			});
			return;
		}

		// Replace req.body with validated data
		req.body = result.data;
		next();
	};
}

// ── Exported Validators ──────────────────────────────────────

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateUpdateUser = validate(updateUserSchema);
export const validateCreateProduct = validate(createProductSchema);
export const validateUpdateProduct = validate(updateProductSchema);
