import express from "express";
import {
  createInventoryItem,
  getAllInventory,
  getInventoryById,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryByUnit,
  getDistinctCategories,
  getInventoryByCategory,
  getLowStockItems,
} from "../controllers/inventoryController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🔐 INVENTORY ROUTES (ROLE-BASED ACCESS)
 * 
 * Admin → Full system-wide access
 * Client → Access to their owned units only
 * Unit Manager → Access to their managed unit(s) only
 */

// 🧾 Get all inventory (Admin only)
router.route("/")
  .get(protect,  getAllInventory)

// ➕ Create inventory item (Admin, Client, or Unit Manager)
  .post(protect,  createInventoryItem);
  router.get("/categories", protect, getDistinctCategories);

//🔍 Filtered routes
router.route("/unit/:unitId").get(protect, authorizeRoles("admin", "client", "Unit Manager"), getInventoryByUnit);
router.route("/category/:category").get(protect, authorizeRoles("admin", "client", "Unit Manager"), getInventoryByCategory);
router.route("/lowstock").get(protect, authorizeRoles("admin", "client", "Unit Manager"), getLowStockItems);



// 📦 Single item routes
router
  .route("/:id")
  .get(protect, authorizeRoles("admin", "client", "Unit Manager"), getInventoryById)
  .put(protect, authorizeRoles("admin", "client", "Unit Manager"), updateInventoryItem)
  .delete(protect, authorizeRoles("admin", "client", "Unit Manager"), deleteInventoryItem);

export default router;
