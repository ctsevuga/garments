import asyncHandler from "../middleware/asyncHandler.js";
import Unit from "../models/unitModel.js";
import User from "../models/userModel.js";

// @desc    Create a new production unit
// @route   POST /api/units
// @access  Private/Admin
const createUnit = asyncHandler(async (req, res) => {
  const { name, owner, managers, address, capacity } = req.body;

  // Check if owner exists
  const ownerExists = await User.findById(owner);
  if (!ownerExists) {
    res.status(400);
    throw new Error("Owner not found");
  }

  const unit = await Unit.create({
    name,
    owner,
    managers,
    address,
    capacity,
  });

  if (unit) {
    res.status(201).json(unit);
  } else {
    res.status(400);
    throw new Error("Invalid unit data");
  }
});

// @desc    Get all units
// @route   GET /api/units
// @access  Private/Admin
// GET /api/units
const getUnits = asyncHandler(async (req, res) => {
  let units;

  // Admin → all units
  if (req.user.role === "admin") {
    units = await Unit.find({})
      .populate("owner", "name phone")
      .populate("managers", "name phone");
  }

  // Client → owned units
  else if (req.user.role === "client") {
    units = await Unit.find({ owner: req.user._id })
      .populate("owner", "name phone")
      .populate("managers", "name phone");
  }

  // Unit Manager → managed units
  else if (req.user.role === "Unit Manager") {
    units = await Unit.find({ managers: req.user._id })
      .populate("owner", "name phone")
      .populate("managers", "name phone");
  }

  // Other roles → empty array
  else {
    units = [];
  }

  res.status(200).json(units);
});


// @desc    Get a single unit by ID
// @route   GET /api/units/:id
// @access  Private/Admin
const getUnitById = asyncHandler(async (req, res) => {
  const unit = await Unit.findById(req.params.id)
    .populate("owner", "name phone")
    .populate("managers", "name phone");

  if (unit) {
    res.json(unit);
  } else {
    res.status(404);
    throw new Error("Unit not found");
  }
});

// @desc    Update a unit
// @route   PUT /api/units/:id
// @access  Private/Admin
const updateUnit = asyncHandler(async (req, res) => {
  const { name, owner, managers, address, capacity, isActive } = req.body;
  const unit = await Unit.findById(req.params.id);

  if (unit) {
    unit.name = name || unit.name;
    unit.owner = owner || unit.owner;
    unit.managers = managers || unit.managers;
    unit.address = address || unit.address;
    unit.capacity = capacity ?? unit.capacity;
    unit.isActive = isActive ?? unit.isActive;

    const updatedUnit = await unit.save();
    res.json(updatedUnit);
  } else {
    res.status(404);
    throw new Error("Unit not found");
  }
});

// @desc    Get all users with role "Unit Manager"
// @route   GET /api/users/managers
// @access  Private (admin or client)



// @desc    Delete a unit
// @route   DELETE /api/units/:id
// @access  Private/Admin
const deleteUnit = asyncHandler(async (req, res) => {
  const unit = await Unit.findById(req.params.id);

  if (unit) {
    await unit.deleteOne();
    res.json({ message: "Unit removed successfully" });
  } else {
    res.status(404);
    throw new Error("Unit not found");
  }
});

// @desc    Get all active units
// @route   GET /api/units/active
// @access  Private
const getActiveUnits = asyncHandler(async (req, res) => {
  const units = await Unit.find({ isActive: true })
    .populate("owner", "name phone")
    .populate("managers", "name phone");

  res.status(200).json(units);
});

// @desc    Get units by owner (for Unit Managers or Admins)
// @route   GET /api/units/owner/:ownerId
// @access  Private
const getUnitsByOwner = asyncHandler(async (req, res) => {
  const { ownerId } = req.params;
  const units = await Unit.find({ owner: ownerId })
    .populate("owner", "name phone")
    .populate("managers", "name phone");

  if (units.length === 0) {
    res.status(404);
    throw new Error("No units found for this owner");
  }

  res.status(200).json(units);
});




export {
  createUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
  getActiveUnits,
  getUnitsByOwner,
  
  
};
