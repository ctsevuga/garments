import mongoose from "mongoose";
import dotenv from "dotenv";
import Inventory from "./models/inventoryModel.js"; 
import inventorySeederData from "./data/inventorySeederData.js";

dotenv.config();

const seedInventory = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");

    await Inventory.deleteMany();
    await Inventory.insertMany(inventorySeederData);

    console.log("🌱 Inventory data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Inventory seeding failed:", error);
    process.exit(1);
  }
};

seedInventory();
