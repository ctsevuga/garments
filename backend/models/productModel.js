import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, unique: true },
    category: { type: String, required: true },
    description: String,
    sizeRange: [String], // e.g. ["S", "M", "L", "XL"]
    colorOptions: [String],
    imageUrl: String,
    unitCost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;