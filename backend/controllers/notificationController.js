import asyncHandler from "../middleware/asyncHandler.js";
import Notification from "../models/notifigationModel.js";
import User from "../models/userModel.js";

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private/Admin or System
const createNotification = asyncHandler(async (req, res) => {
  const { user, title, message, type } = req.body;

  // Validate target user
  const userExists = await User.findById(user);
  if (!userExists) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const notification = await Notification.create({
    user,
    title,
    message,
    type,
  });

  res.status(201).json(notification);
});

// @desc    Get all notifications (Admin only)
// @route   GET /api/notifications
// @access  Private/Admin
const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({})
    .populate("user", "name email phone role")
    .sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications/my
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json(notifications);
});

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  // Ensure user owns this notification
  if (notification.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to modify this notification");
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({ message: "Notification marked as read" });
});

// @desc    Mark all notifications as read for a user
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });

  res.status(200).json({ message: "All notifications marked as read" });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  // Ensure user owns this notification or is admin
  if (
    notification.user.toString() !== req.user._id.toString() &&
    req.user.role !== "Admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this notification");
  }

  await notification.deleteOne();
  res.status(200).json({ message: "Notification deleted successfully" });
});

export {
  createNotification,
  getAllNotifications,
  getMyNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
};
