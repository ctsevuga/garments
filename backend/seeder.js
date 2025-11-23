import mongoose from "mongoose";
import dotenv from "dotenv";
import Notification from "./models/notifigationModel.js";
import notificationSeederData from "./data/notificationSeederData.js";

dotenv.config();

const seedNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");

    await Notification.deleteMany();
    await Notification.insertMany(notificationSeederData);

    console.log("🌱 50 Notifications seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Notification seeding failed:", error);
    process.exit(1);
  }
};

seedNotifications();
