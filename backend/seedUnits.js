import mongoose from "mongoose";
import dotenv from "dotenv";
import Unit from "./models/unitModel.js";
import unitSeederData from "./data/unitSeederData.js";

dotenv.config();

const seedUnits = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");

    await Unit.deleteMany();
    await Unit.insertMany(unitSeederData);

    console.log("🌱 Unit data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedUnits();
