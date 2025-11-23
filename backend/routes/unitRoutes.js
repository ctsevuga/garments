import express from "express";
import {
  createUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
  getActiveUnits,
  getUnitsByOwner,
  
  
} from "../controllers/unitController.js";
import { protect, admin,authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public/Private routes (depending on your use case)
router.route("/active").get(protect, getActiveUnits);


router.get("/", protect, getUnits);


// Admin-only routes
router
  .route("/").post(protect, admin, createUnit); // Create new unit

router
  .route("/:id")
  .get(protect,  getUnitById) // Get single unit
  .put(protect,  updateUnit) // Update unit
//🟩 Client: Get owned units


// 🟦 Get units by owner (for Admins or Managers)
router.route("/owner/:ownerId").get(protect, authorizeRoles("admin", "Unit Manager"), getUnitsByOwner);



  

export default router;
