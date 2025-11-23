import asyncHandler from "../middleware/asyncHandler.js";
import Inventory from "../models/inventoryModel.js";
import Unit from "../models/unitModel.js";

/**
 * @desc Create new inventory item
 * @route POST /api/inventory
 * @access Admin, Client, Unit Manager
 */
const createInventoryItem = asyncHandler(async (req, res) => {
  const { unit, itemName, category, quantity, unitOfMeasure, reorderLevel, supplierName } = req.body;
  const user = req.user;

  // ✅ Check if the unit exists
  const unitExists = await Unit.findById(unit);
  if (!unitExists) {
    res.status(400);
    throw new Error("Invalid unit ID");
  }

  // ✅ Role-based access control
  switch (user.role) {
    case "client":
      if (unitExists.owner.toString() !== user._id.toString()) {
        res.status(403);
        throw new Error("Access denied: You don't own this unit");
      }
      break;

    case "Unit Manager":
      if (!unitExists.managers.map(id => id.toString()).includes(user._id.toString())) {
        res.status(403);
        throw new Error("Access denied: You're not a manager of this unit");
      }
      break;

    case "admin":
      // Admin can create inventory items for any unit
      break;

    default:
      res.status(403);
      throw new Error("Access denied: Unauthorized role");
  }

  // ✅ Create inventory item
  const inventoryItem = await Inventory.create({
    unit,
    itemName,
    category,
    quantity,
    unitOfMeasure,
    reorderLevel,
    supplierName,
  });

  res.status(201).json(inventoryItem);
});


/**
 * @desc Get all inventory (Admin only)
 * @route GET /api/inventory
 */
const getAllInventory = asyncHandler(async (req, res) => {
  const { role, userId } = req.user; // Assuming `req.user` contains the authenticated user

  let inventory;

  if (role === "admin") {
    // Admin: Fetch all inventories across the system
    inventory = await Inventory.find().populate("unit"); // Admin can access all inventories and units
  } else if (role === "client") {
    // Client: Fetch inventories only for units they own
    inventory = await Inventory.find()
      .populate({
        path: "unit",
        match: { owner: userId }, // Match units where the owner is the logged-in client
      })
      .exec();
  } else if (role === "Unit Manager") {
    // Unit Manager: Fetch inventories only for units they manage
    inventory = await Inventory.find()
      .populate({
        path: "unit",
        match: { manager: userId }, // Match units where the manager is the logged-in user
      })
      .exec();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Filter out inventories where the unit does not match (i.e., unit is not found due to role-based filtering)
  inventory = inventory.filter((item) => item.unit); // Only return items where the unit exists

  res.json(inventory);
});



/**
 * @desc Get inventory by unit (Client / Manager limited)
 * @route GET /api/inventory/unit/:unitId
 */
const getInventoryByUnit = asyncHandler(async (req, res) => {
  const user = req.user;
  const { unitId } = req.params;

  const unit = await Unit.findById(unitId);
  if (!unit) {
    res.status(404);
    throw new Error("Unit not found");
  }

  // 🔒 Restrict access to unit owners/managers
  if (user.role === "client" && unit.owner.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error("Access denied: You do not own this unit");
  }
  if (user.role === "Unit Manager" && !unit.managers.includes(user._id)) {
    res.status(403);
    throw new Error("Access denied: You are not a manager of this unit");
  }

  const inventory = await Inventory.find({ unit: unitId });
  res.json(inventory);
});

/**
 * @desc Update inventory item (Role-based)
 * @route PUT /api/inventory/:id
 */
const updateInventoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const inventoryItem = await Inventory.findById(id).populate("unit");
  if (!inventoryItem) {
    res.status(404);
    throw new Error("Inventory item not found");
  }

  // 🔒 Role-based access
  if (user.role === "client" && inventoryItem.unit.owner.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error("Access denied: You do not own this unit");
  }
  if (user.role === "Unit Manager" && !inventoryItem.unit.managers.includes(user._id)) {
    res.status(403);
    throw new Error("Access denied: You are not a manager of this unit");
  }

  // ✅ Update fields
  Object.assign(inventoryItem, req.body);
  await inventoryItem.save();

  res.json(inventoryItem);
});

const getDistinctCategories = asyncHandler(async (req, res) => {
  // Fetch DISTINCT category values directly from MongoDB
  const categories = await Inventory.distinct("category");

  res.status(200).json(categories);
});

/**
 * @desc Delete inventory item
 * @route DELETE /api/inventory/:id
 */
const deleteInventoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const inventoryItem = await Inventory.findById(id).populate("unit");
  if (!inventoryItem) {
    res.status(404);
    throw new Error("Inventory item not found");
  }

  // 🔒 Role-based access
  if (user.role === "client" && inventoryItem.unit.owner.toString() !== user._id.toString()) {
    res.status(403);
    throw new Error("Access denied: You do not own this unit");
  }
  if (user.role === "Unit Manager" && !inventoryItem.unit.managers.includes(user._id)) {
    res.status(403);
    throw new Error("Access denied: You are not a manager of this unit");
  }

  await inventoryItem.remove();
  res.json({ message: "Inventory item deleted successfully" });
});
/**
 * @desc    Get inventory items by category
 * @route   GET /api/inventory/category/:category
 * @access  Private (Admin, Client, Unit Manager)
 */
const getInventoryByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  // Validate category
  const validCategories = ["fabric", "trim", "accessory", "other"];
  if (!validCategories.includes(category)) {
    res.status(400);
    throw new Error("Invalid category");
  }

  const items = await Inventory.find({ category }).populate("unit", "name");

  if (items.length === 0) {
    res.status(404);
    throw new Error("No inventory items found for this category");
  }

  res.status(200).json(items);
});

/**
 * @desc    Get single inventory item by ID
 * @route   GET /api/inventory/:id
 * @access  Private (Admin, Client, Unit Manager)
 */
const getInventoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await Inventory.findById(id).populate("unit", "name");

  if (!item) {
    res.status(404);
    throw new Error("Inventory item not found");
  }

  res.status(200).json(item);
});
/**
 * @desc    Get all low stock inventory items (quantity ≤ reorderLevel)
 * @route   GET /api/inventory/lowstock
 * @access  Private/Admin
 */
const getLowStockItems = asyncHandler(async (req, res) => {
  // Find all items where quantity is less than or equal to reorder level
  const lowStockItems = await Inventory.find({
    $expr: { $lte: ["$quantity", "$reorderLevel"] },
  }).populate("unit", "name");

  if (!lowStockItems || lowStockItems.length === 0) {
    res.status(404);
    throw new Error("No low stock items found");
  }

  res.status(200).json(lowStockItems);
});


export {
  createInventoryItem,
  getAllInventory,
  getInventoryByUnit,
  updateInventoryItem,
  deleteInventoryItem,
  getDistinctCategories,
  getInventoryByCategory, 
  getInventoryById,
  getLowStockItems,
};
