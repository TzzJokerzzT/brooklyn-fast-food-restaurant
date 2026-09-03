import { type Router as ExpressRouter, Router } from "express";

import { ProductRepository } from "@/infrastructure/repositories/product.repository.js";
import { ProductService } from "@/infrastructure/services/product.service.js";
import { authenticate, requireAdmin } from "@/middleware/auth.middleware.js";
import {
	validateCreateProduct,
	validateUpdateProduct,
} from "@/middleware/validation.middleware.js";
import { ProductsController } from "@/presentation/controllers/products.controller.js";

import multer from "multer";

// ── Products Routes ──────────────────────────────────────────
// Admin-only routes for product management

const router: ExpressRouter = Router();

// Multer config for image uploads
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
	fileFilter: (_req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed"));
		}
	},
});

// Create dependencies
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productsController = new ProductsController(productService);

// Public routes
router.get("/", (req, res) => productsController.getAll(req, res));

router.get("/:id", (req, res) => productsController.getById(req, res));

// Protected routes (admin only)
router.use(authenticate);
router.use(requireAdmin);

router.post(
	"/",
	upload.single("productImage"),
	validateCreateProduct,
	(req, res) => productsController.create(req, res),
);

router.post("/bulk", (req, res) => productsController.createMany(req, res));

router.put(
	"/:id",
	upload.single("productImage"),
	validateUpdateProduct,
	(req, res) => productsController.update(req, res),
);

router.delete("/:id", (req, res) => productsController.delete(req, res));

router.delete("/bulk", (req, res) => productsController.deleteMany(req, res));

export { router as productsRouter };
