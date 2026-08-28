import { type Router as ExpressRouter, Router } from "express";

import {
	authenticate,
	requireAdmin,
	requireSuperAdmin,
} from "@/middleware/auth.middleware.js";
import { validateUpdateUser } from "@/middleware/validation.middleware.js";
import { UsersController } from "@/presentation/controllers/users.controller.js";

// ── Users Routes ─────────────────────────────────────────────
// Admin-only routes for user management

const router: ExpressRouter = Router();
const usersController = new UsersController();

// All routes require authentication
router.use(authenticate);

// Admin routes (admin or super-admin)
router.get("/", requireAdmin, (req, res) => usersController.getAll(req, res));

router.get("/:id", requireAdmin, (req, res) =>
	usersController.getById(req, res),
);

router.post("/", requireSuperAdmin, (req, res) =>
	usersController.create(req, res),
);

router.put("/:id", validateUpdateUser, requireAdmin, (req, res) =>
	usersController.update(req, res),
);

// Role management (super-admin only)
router.patch("/:id/role", requireSuperAdmin, (req, res) =>
	usersController.updateRole(req, res),
);

// Status management (admin or super-admin)
router.patch("/:id/status", requireAdmin, (req, res) =>
	usersController.updateStatus(req, res),
);

// Delete (super-admin only)
router.delete("/:id", requireSuperAdmin, (req, res) =>
	usersController.delete(req, res),
);

export { router as usersRouter };
