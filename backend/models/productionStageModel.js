import mongoose from "mongoose";

const productionStageSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    stage: {
      type: String,
      enum: ["Cutting", "Stitching", "Finishing", "Packaging", "Completed"],
      required: true,
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    progress: { type: Number, default: 0 }, // percent complete
    remarks: String,
  },
  { timestamps: true }
);

const ProductionStage = mongoose.model("ProductionStage", productionStageSchema);
export default ProductionStage;