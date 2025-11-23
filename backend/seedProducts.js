import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js"; 
import productSeederData from "./data/productSeederData.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");

    await Product.deleteMany();
    await Product.insertMany(productSeederData);

    console.log("🌱 Product data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedProducts();
