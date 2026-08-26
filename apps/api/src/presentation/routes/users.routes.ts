import { type Router as ExpressRouter, Router } from "express";

import {
	authenticate,
	requireAdmin,
	requireSuperAdmin,
} from "../../middleware/auth.middleware.js";
import {
	registerSchema,
	updateUserSchema,
	validate,
} from "../../middleware/validation.middleware.js";
import { UsersController } from "../controllers/users.controller.js";

// ── Users Routes ─────────────────────────────────────────────
// /api/v1/users/*

export const usersRouter: ExpressRouter = Router();

// All routes require authentication
usersRouter.use(authenticate);

// Admin+ routes
usersRouter.get("/", requireAdmin, UsersController.index);
usersRouter.get("/:id", requireAdmin, UsersController.show);

// Super-admin only routes
usersRouter.post(
	"/",
	requireSuperAdmin,
	validate(registerSchema),
	UsersController.store,
);
usersRouter.put(
	"/:id",
	requireSuperAdmin,
	validate(updateUserSchema),
	UsersController.update,
);
usersRouter.delete("/:id", requireSuperAdmin, UsersController.destroy);
usersRouter.patch("/:id/role", requireSuperAdmin, UsersController.updateRole);
usersRouter.patch(
	"/:id/status",
	requireSuperAdmin,
	UsersController.updateStatus,
);
