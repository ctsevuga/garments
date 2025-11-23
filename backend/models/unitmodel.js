import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    address: {
      address: String,
      city: String,
      pincode: String,
      phoneNumber: String,
    },
    capacity: { type: Number, default: 0 }, // garments per day
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Check if model already exists
const Unit = mongoose.models.Unit || mongoose.model("Unit", unitSchema);

export default Unit;
