import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByClient,
  getOrdersByUnit,
  getOrdersByStatus,
} from "../controllers/orderController.js";

// Optional: middleware for authentication/authorization
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
  Base route: /api/orders
  You can mount it in server.js as:
  app.use("/api/orders", orderRoutes);
*/

// 🔹 Create new order
router.post("/", /* protect, */ createOrder);
router.get("/client", protect, getOrdersByClient);

// 🔹 Get all orders
router.get("/", /* protect, admin, */ getAllOrders);

// 🔹 Get order by ID
router.get("/:id", /* protect, */ getOrderById);

// 🔹 Update order (details or status)
router.put("/:id", /* protect, */ updateOrder);

// 🔹 Delete an order
router.delete("/:id", /* protect, admin, */ deleteOrder);

// 🔹 Get all orders for a specific client


// 🔹 Get all orders assigned to a specific unit
router.get("/unit/:unitId", /* protect, */ getOrdersByUnit);

// 🔹 Get orders by status
router.get("/status/:status", /* protect, admin, */ getOrdersByStatus);

export default router;
