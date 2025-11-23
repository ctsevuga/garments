import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    message: String,
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ["order", "inventory", "system"], default: "system" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;