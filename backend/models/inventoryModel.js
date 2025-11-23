import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    itemName: { type: String, required: true },
    category: { type: String, enum: ["fabric", "trim", "accessory", "other"], default: "fabric" },
    quantity: { type: Number, required: true },
    unitOfMeasure: { type: String, default: "meters" }, // or "pieces"
    reorderLevel: { type: Number, default: 10 },
    supplierName: String,
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;