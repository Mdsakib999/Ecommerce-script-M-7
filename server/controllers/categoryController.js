const Category = require("../models/Category");

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get single product by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({
            message: 'Category not found'
        });
        res.json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
//Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const Product = require('../models/Product');
        const category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ message: "Category not found" });

        // Check if any products use this category
        const productsUsingCategory = await Product.countDocuments({
            category: category.name
        });

        if (productsUsingCategory > 0) {
            return res.status(400).json({
                message: `Cannot delete category. ${productsUsingCategory} product(s) are using this category.`
            });
        }

        await category.deleteOne();
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// update category
exports.updateCategory = async (req, res) => {
    try {
        const updateData = { ...req.body };
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({
            message: 'Category not found'
        });
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// Create new category (admin only)
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "name missing" });
        }
        const category = new Category({
            name,
        });
        const createdCategory = await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: "Category Creation Failed", error: error.message });
    }
};