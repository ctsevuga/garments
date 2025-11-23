import express from "express";
import {
  createProductionStage,
  getAllProductionStages,
  getProductionStageById,
  updateProductionStage,
  deleteProductionStage,
  getStagesByOrder,
  getStagesByUnit,
  getStagesByType,
} from "../controllers/productionStageController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Main routes
router
  .route("/")
  .get(protect, admin, getAllProductionStages)
  .post(protect, createProductionStage);

// Filtered routes
router.get("/order/:orderId", protect, getStagesByOrder);
router.get("/unit/:unitId", protect, getStagesByUnit);
router.get("/type/:stage", protect,  getStagesByType);

// Single stage routes
router
  .route("/:id")
  .get(protect, getProductionStageById)
  .put(protect, updateProductionStage)
  .delete(protect, admin, deleteProductionStage);

export default router;
