import asyncHandler from "../middleware/asyncHandler.js";
import ProductionStage from "../models/productionStageModel.js";
import Order from "../models/orderModel.js";
import Unit from "../models/unitmodel.js";
// Add this at the top of your file
import mongoose from 'mongoose';


// @desc    Create a new production stage
// @route   POST /api/production-stages
// @access  Private/Admin or Unit Manager
const createProductionStage = asyncHandler(async (req, res) => {
  const { order, unit, stage, startedAt, completedAt, progress, remarks } = req.body;

  // Validate order & unit
  const orderExists = await Order.findById(order);
  if (!orderExists) {
    res.status(400);
    throw new Error("Invalid order ID");
  }

  const unitExists = await Unit.findById(unit);
  if (!unitExists) {
    res.status(400);
    throw new Error("Invalid unit ID");
  }

  const newStage = await ProductionStage.create({
    order,
    unit,
    stage,
    startedAt,
    completedAt,
    progress,
    remarks,
  });

  res.status(201).json(newStage);
});

// @desc    Get all production stages
// @route   GET /api/production-stages
// @access  Private/Admin
const getAllProductionStages = asyncHandler(async (req, res) => {
  const {
    order,
    unit,
    stage,
    type,
    progressMin,
    progressMax,
    page: pageQuery,
    limit: limitQuery,
  } = req.query;

  // Pagination
  const page = parseInt(pageQuery) || 1;
  const limit = parseInt(limitQuery) || 10;
  const skip = (page - 1) * limit;

  // Build safe filter query
  const matchQuery = {};

  if (unit && mongoose.Types.ObjectId.isValid(unit)) {
    matchQuery.unit = new mongoose.Types.ObjectId(unit);
  }

  if (order && mongoose.Types.ObjectId.isValid(order)) {
    matchQuery.order = new mongoose.Types.ObjectId(order);
  }

  if (stage && stage.trim() !== "") {
    matchQuery.stage = stage;
  }

  if (type && type.trim() !== "") {
    matchQuery.type = type;
  }

  if (progressMin !== undefined || progressMax !== undefined) {
    matchQuery.progress = {};
    if (progressMin !== undefined) matchQuery.progress.$gte = Number(progressMin);
    if (progressMax !== undefined) matchQuery.progress.$lte = Number(progressMax);
  }

  // Fetch production stages with pagination
  const stages = await ProductionStage.find(matchQuery)
    .populate("order", "orderNumber client qty deadline")
    .populate("unit", "name city manager")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalStages = await ProductionStage.countDocuments(matchQuery);

  res.status(200).json({
    totalStages,
    page,
    limit,
    totalPages: Math.ceil(totalStages / limit),
    stages,
  });
});

export default getAllProductionStages;




// @desc    Get a single production stage by ID
// @route   GET /api/production-stages/:id
// @access  Private
const getProductionStageById = asyncHandler(async (req, res) => {
  const stage = await ProductionStage.findById(req.params.id)
    .populate("order", "orderNumber status client")
    .populate("unit", "name city");

  if (stage) {
    res.status(200).json(stage);
  } else {
    res.status(404);
    throw new Error("Production stage not found");
  }
});

// @desc    Update a production stage (progress, completion, remarks)
// @route   PUT /api/production-stages/:id
// @access  Private/Admin or Unit Manager
const updateProductionStage = asyncHandler(async (req, res) => {
  const { stage, progress, completedAt, remarks } = req.body;
  const prodStage = await ProductionStage.findById(req.params.id);

  if (!prodStage) {
    res.status(404);
    throw new Error("Production stage not found");
  }

  prodStage.stage = stage || prodStage.stage;
  prodStage.progress = progress ?? prodStage.progress;
  prodStage.completedAt = completedAt || prodStage.completedAt;
  prodStage.remarks = remarks || prodStage.remarks;

  // If progress hits 100%, mark as completed
  if (progress === 100 && !prodStage.completedAt) {
    prodStage.completedAt = new Date();
  }

  const updated = await prodStage.save();
  res.status(200).json(updated);
});

// @desc    Delete a production stage
// @route   DELETE /api/production-stages/:id
// @access  Private/Admin
const deleteProductionStage = asyncHandler(async (req, res) => {
  const stage = await ProductionStage.findById(req.params.id);
  if (!stage) {
    res.status(404);
    throw new Error("Production stage not found");
  }

  await stage.deleteOne();
  res.status(200).json({ message: "Production stage deleted successfully" });
});

// @desc    Get all stages for a specific order
// @route   GET /api/production-stages/order/:orderId
// @access  Private
const getStagesByOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const stages = await ProductionStage.find({ order: orderId })
    .populate("unit", "name city")
    .sort({ startedAt: 1 });

  if (!stages.length) {
    res.status(404);
    throw new Error("No production stages found for this order");
  }

  res.status(200).json(stages);
});

// @desc    Get all stages for a specific unit
// @route   GET /api/production-stages/unit/:unitId
// @access  Private
const getStagesByUnit = asyncHandler(async (req, res) => {
  const { unitId } = req.params;

  const stages = await ProductionStage.find({ unit: unitId })
    .populate("order", "orderNumber status client")
    .sort({ startedAt: 1 });

  if (!stages.length) {
    res.status(404);
    throw new Error("No production stages found for this unit");
  }

  res.status(200).json(stages);
});

// @desc    Get stages by type (e.g. "Cutting")
// @route   GET /api/production-stages/type/:stage
// @access  Private/Admin
const getStagesByType = asyncHandler(async (req, res) => {
  const { stage } = req.params;

  const stages = await ProductionStage.find({ stage })
    .populate("order", "orderNumber status")
    .populate("unit", "name");

  if (!stages.length) {
    res.status(404);
    throw new Error(`No production stages found for type: ${stage}`);
  }

  res.status(200).json(stages);
});

export {
  createProductionStage,
  getAllProductionStages,
  getProductionStageById,
  updateProductionStage,
  deleteProductionStage,
  getStagesByOrder,
  getStagesByUnit,
  getStagesByType,
};
