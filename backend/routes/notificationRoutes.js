
import express from "express";
import {
  createNotification,
  getAllNotifications,
  getMyNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only: get all notifications
router.route("/").get(protect, admin, getAllNotifications).post(protect, admin, createNotification);

// Logged-in user: get their notifications
router.route("/my").get(protect, getMyNotifications);

// Mark all as read
router.route("/mark-all-read").put(protect, markAllAsRead);

// Single notification actions
router.route("/:id/read").put(protect, markNotificationAsRead);
router.route("/:id").delete(protect, deleteNotification);

export default router;
