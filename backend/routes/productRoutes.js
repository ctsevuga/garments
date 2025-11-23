import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductBySKU,
  getUniqueCategories,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/categories", getUniqueCategories);
router.route("/").get(getProducts); // Get all products
router.route("/category/:category").get(getProductsByCategory); // Filter by category
router.route("/sku/:sku").get(getProductBySKU); // Get by SKU
router.route("/:id").get(getProductById); // Get by ID

// Admin-only routes
router.route("/").post(protect, admin, createProduct); // Create
router.route("/:id").put(protect, admin, updateProduct).delete(protect, admin, deleteProduct); // Update & Delete

export default router;
