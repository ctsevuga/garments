import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./models/orderModel.js";
import orderSeederData from "./data/orderSeederData.js";

dotenv.config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");

    await Order.deleteMany();
    await Order.insertMany(orderSeederData);

    console.log("🌱 50 Orders seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Order seeding failed:", error);
    process.exit(1);
  }
};

seedOrders();
