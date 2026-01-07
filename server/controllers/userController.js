const User = require('../models/User');
const uploadUserPhoto = require('../utils/uploadUserPhoto');
const cloudinary = require('../config/cloudinary');
exports.syncUser = async (req, res) => {
  const { uid, email, picture } = req.user;
  const name = req.body.name || req.user.name; // Prioritize body name (manual), then token name (google)

  let user = await User.findOne({ firebaseUid: uid });

  if (user && user.isBanned) {
    return res.status(403).json({ message: "Your account has been banned. Please contact support." });
  }

  if (!user) {
    user = await User.create({
      firebaseUid: uid,
      email,
      name: name || email.split("@")[0],
      googlePhotoUrl: picture,
      isAdmin: false, // default
    });
  } else if (picture && user.googlePhotoUrl !== picture) {
    // Update google photo if changed
    user.googlePhotoUrl = picture;
    await user.save();
  }

  res.json(user);
};

// Toggle Ban Status (Admin only)
exports.toggleBanStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent banning self
    if (user.firebaseUid === req.user.uid) {
      return res.status(400).json({ message: "You cannot ban yourself." });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      message: user.isBanned ? 'User has been banned' : 'User access restored',
      isBanned: user.isBanned
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Upload or update user profile photo
exports.uploadPhoto = async (req, res) => {
  try {
    const { uid } = req.user; // From Firebase auth middleware

    // Find user
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate file exists
    if (!req.file) {
      return res.status(400).json({ message: 'No photo file provided' });
    }

    // Validate file type
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: 'Invalid file type. Only JPG, PNG, WEBP allowed.'
      });
    }

    // Validate file size (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ message: 'Image must be under 5MB' });
    }

    // Delete old photo from Cloudinary if exists
    if (user.profileImage?.publicId) {
      try {
        await cloudinary.uploader.destroy(user.profileImage.publicId);
      } catch (error) {
        console.error('Error deleting old photo:', error);
        // Continue even if deletion fails
      }
    }

    // Upload new photo to Cloudinary
    const uploadResult = await uploadUserPhoto(req.file.buffer);

    // Update user in database
    user.profileImage = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
    await user.save();

    res.json({
      message: 'Photo uploaded successfully',
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      message: 'Photo upload failed',
      error: error.message
    });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

