const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/AuthMiddleware');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/uploadMiddleware');
const { getAllCategories, getCategoryById, updateCategory, deleteCategory, createCategory } = require('../controllers/categoryController');

router.get('/', getAllCategories);

// Admin routes
router.route('/:id')
    .get(getCategoryById)
    .put(verifyFirebaseToken, isAdmin, updateCategory)
    .delete(verifyFirebaseToken, isAdmin, deleteCategory)

router.post('/', verifyFirebaseToken, isAdmin, createCategory);

module.exports = router;