const express = require('express');
const verifyFirebaseToken = require('../middleware/AuthMiddleware');
const { syncUser, uploadPhoto } = require('../controllers/userController.js');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// Sync user after Firebase auth (for Google sign-in or after registration)
router.post("/sync", verifyFirebaseToken, syncUser);

// Upload user profile photo (authenticated users only)
router.post("/upload-photo", verifyFirebaseToken, upload.single('photo'), uploadPhoto);

module.exports = router;
