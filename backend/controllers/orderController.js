import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Unit from "../models/unitmodel.js";
import User from "../models/userModel.js";

// Utility to generate a unique order number (e.g. ORD-20241105-001)
const generateOrderNumber = async () => {
  const datePrefix = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const count = await Order.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } });
  return `ORD-${datePrefix}-${(count + 1).toString().padStart(3, "0")}`;
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private/Admin or Client
const createOrder = asyncHandler(async (req, res) => {
  const { orderNumber, client, assignedUnits, items, dueDate, notes } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("Order must contain at least one item");
  }

  // Validate client
  const clientExists = await User.findById(client);
  if (!clientExists) {
    res.status(400);
    throw new Error("Invalid client ID");
  }

  // Calculate total quantity
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  const newOrder = await Order.create({
    orderNumber: orderNumber || (await generateOrderNumber()),
    client,
    assignedUnits,
    items,
    totalQuantity,
    dueDate,
    notes,
  });

  res.status(201).json(newOrder);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { client, startDate, endDate, status } = req.query;

  // Pagination setup
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build the match query based on filters
  const matchQuery = {};

  if (client) matchQuery.client = new mongoose.Types.ObjectId(client);
  if (status) matchQuery.status = status;

  // 🔥 NEW: Filter by dueDate (instead of createdAt)
  if (startDate && endDate) {
    matchQuery.dueDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  } else if (startDate) {
    matchQuery.dueDate = { $gte: new Date(startDate) };
  } else if (endDate) {
    matchQuery.dueDate = { $lte: new Date(endDate) };
  }

  const orders = await Order.find(matchQuery)
    .populate("client", "name email phone")
    .populate("assignedUnits", "name city capacity")
    .populate("items.product", "name sku category")
    .sort({ createdAt: -1 }) // sorting stays on creation time
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments(matchQuery);

  res.status(200).json({
    totalOrders,
    page,
    limit,
    totalPages: Math.ceil(totalOrders / limit),
    orders,
  });
});



// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("client", "name email phone")
    .populate("assignedUnits", "name city capacity")
    .populate("items.product", "name sku category");

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order details or status
// @route   PUT /api/orders/:id
// @access  Private/Admin or Unit Manager
const updateOrder = asyncHandler(async (req, res) => {
  const { assignedUnits, status, dueDate, notes } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.assignedUnits = assignedUnits || order.assignedUnits;
  order.status = status || order.status;
  order.dueDate = dueDate || order.dueDate;
  order.notes = notes || order.notes;

  const updatedOrder = await order.save();
  res.status(200).json(updatedOrder);
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  await order.deleteOne();
  res.status(200).json({ message: "Order deleted successfully" });
});

// @desc    Get all orders for a specific client
// @route   GET /api/orders/client/:clientId
// @access  Private
const getOrdersByClient = asyncHandler(async (req, res) => {
  try {
    const clientId = req.user._id;
    const { startDate, endDate, status } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matchQuery = { client: clientId };

    if (status) matchQuery.status = status;

    if (startDate && !isNaN(new Date(startDate))) {
      matchQuery.dueDate = matchQuery.dueDate || {};
      matchQuery.dueDate.$gte = new Date(startDate);
    }
    if (endDate && !isNaN(new Date(endDate))) {
      matchQuery.dueDate = matchQuery.dueDate || {};
      matchQuery.dueDate.$lte = new Date(endDate);
    }

    const orders = await Order.find(matchQuery)
      .populate("items.product", "name sku category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(matchQuery);

    res.status(200).json({
      totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});





// @desc    Get all orders assigned to a specific unit
// @route   GET /api/orders/unit/:unitId
// @access  Private
const getOrdersByUnit = asyncHandler(async (req, res) => {
  const { unitId } = req.params;

  // Pagination setup
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const matchQuery = {
    assignedUnits: unitId,
  };

  // Fetch orders with pagination
  const orders = await Order.find(matchQuery)
    .populate("client", "name phone")
    .populate("items.product", "name sku category")
    .sort({ createdAt: -1 })     // newest first
    .skip(skip)
    .limit(limit);

  // Count total documents
  const totalOrders = await Order.countDocuments(matchQuery);

  res.status(200).json({
    totalOrders,
    page,
    limit,
    totalPages: Math.ceil(totalOrders / limit),
    orders,
  });
});


// @desc    Get orders by status (e.g., "In Production")
// @route   GET /api/orders/status/:status
// @access  Private/Admin
const getOrdersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const { unit } = req.query;

  const filter = { status };

  if (unit) {
    filter.assignedUnits = unit;
  }

  const orders = await Order.find(filter)
    .populate("client", "name phone")
    .populate("assignedUnits", "name")
    .populate("items.product", "name sku category");

  res.status(200).json(orders);
});


export {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByClient,
  getOrdersByUnit,
  getOrdersByStatus,
};
