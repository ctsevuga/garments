import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    size: String,
    color: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // buyer or brand
    assignedUnits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
    items: [orderItemSchema],
    totalQuantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Created", "In Production", "Quality Check", "Shipped", "Delivered", "Cancelled"],
      default: "Created",
    },
    dueDate: Date,
    notes: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;