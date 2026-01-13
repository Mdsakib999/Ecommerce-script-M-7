const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const uploadFromBuffer = require('../utils/uploadFromBuffer');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];
// Get all products
exports.getProducts = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // 12 products per page
    const skip = (page - 1) * limit;

    // Keyword search filter
    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};

    // Category filter
    const categoryFilter = req.query.category && req.query.category !== 'all'
      ? { category: req.query.category }
      : {};

    // Combine filters
    const filters = { ...keyword, ...categoryFilter };

    // Build sort object
    let sortOptions = {};
    switch (req.query.sort) {
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'name-asc':
        sortOptions = { name: 1 };
        break;
      case 'name-desc':
        sortOptions = { name: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 }; // Default: newest first
    }

    // Execute query with pagination
    const products = await Product.find(filters)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip);

    // Get total count for pagination info
    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / limit);

    // Return paginated response
    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({
      message: 'Product not found'
    });
    res.json(product);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}
// update product
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle isFeatured boolean conversion
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    }

    // Parse specifications if sent as string
    if (updateData.specifications) {
      try {
        updateData.specifications = typeof updateData.specifications === 'string'
          ? JSON.parse(updateData.specifications)
          : updateData.specifications;
      } catch (err) {
        console.error("Specs parsing error during update", err);
      }
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({
      message: 'Product not found'
    });
    if (req.file && req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Image must be under 5MB' });
    }
    if (req.file) {
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      updateData.imageUrl = uploadResult.secure_url;
      updateData.imagePublicId = uploadResult.public_id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//Delete product
exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);
    // Delete image from Cloudinary
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.imageUrl && product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }
    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, countInStock, category, specifications, isFeatured } = req.body;

    // Parse specifications if sent as string
    let specs = [];
    if (specifications) {
      try {
        specs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
      } catch (err) {
        console.error("Specs parsing error", err);
        return res.status(400).json({ message: "Invalid specifications format" });
      }
    }

    if (!name || !description || !price) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file type. Only JPG, PNG, WEBP allowed."
        });
      }
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      specifications: specs,
      imageUrl,
      imagePublicId,
      countInStock: countInStock || 0,
      category: category || "",
      isFeatured,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Product Creation Failed", error: error.message });
  }
};
