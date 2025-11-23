import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, description, sizeRange, colorOptions, imageUrl, unitCost } = req.body;

  // Check for duplicate SKU
  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    res.status(400);
    throw new Error("Product with this SKU already exists");
  }

  const product = await Product.create({
    name,
    sku,
    category,
    description,
    sizeRange,
    colorOptions,
    imageUrl,
    unitCost,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

// @desc    Get a product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, description, sizeRange, colorOptions, imageUrl, unitCost } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.sku = sku || product.sku;
    product.category = category || product.category;
    product.description = description || product.description;
    product.sizeRange = sizeRange || product.sizeRange;
    product.colorOptions = colorOptions || product.colorOptions;
    product.imageUrl = imageUrl || product.imageUrl;
    product.unitCost = unitCost ?? product.unitCost;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const getUniqueCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.status(200).json({ message: "Product removed successfully" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category });

  if (products.length === 0) {
    res.status(404);
    throw new Error("No products found for this category");
  }

  res.status(200).json(products);
});

// @desc    Get product by SKU
// @route   GET /api/products/sku/:sku
// @access  Public
const getProductBySKU = asyncHandler(async (req, res) => {
  const { sku } = req.params;
  const product = await Product.findOne({ sku });

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductBySKU,
  getUniqueCategories,
};
