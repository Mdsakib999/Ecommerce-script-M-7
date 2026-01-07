const express = require('express');
const verifyFirebaseToken = require('../middleware/AuthMiddleware');
const { syncUser, uploadPhoto, getAllUsers, deleteUser, toggleBanStatus } = require('../controllers/userController.js');
const upload = require('../middleware/uploadMiddleware');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// Sync user after Firebase auth (for Google sign-in or after registration)
router.post("/sync", verifyFirebaseToken, syncUser);

// Upload user profile photo (authenticated users only)
router.post("/upload-photo", verifyFirebaseToken, upload.single('photo'), uploadPhoto);

// Admin routes
router.get('/', verifyFirebaseToken, isAdmin, getAllUsers);
router.put('/:id/ban', verifyFirebaseToken, isAdmin, toggleBanStatus);
router.delete('/:id', verifyFirebaseToken, isAdmin, deleteUser);

module.exports = router;
