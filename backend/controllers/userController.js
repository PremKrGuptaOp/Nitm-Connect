const User = require('../models/User');
const Match = require('../models/Match'); // Import the Match model

// @desc    Get user profiles for the dashboard
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
    // ... existing function
};

// @desc    Like a user profile
// @route   POST /api/users/like/:id
// @access  Private
const likeProfile = async (req, res) => {
  const likedUserId = req.params.id;
  const currentUserId = req.user._id;

  try {
    // Add the liked user to the current user's likedProfiles array
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { likedProfiles: likedUserId },
    });

    // Check if the other user has also liked the current user
    const likedUser = await User.findById(likedUserId);
    if (likedUser.likedProfiles.includes(currentUserId)) {
      // It's a match!
      // Check if a match already exists to prevent duplicates
      const existingMatch = await Match.findOne({
        users: { $all: [currentUserId, likedUserId] },
      });

      if (!existingMatch) {
        await Match.create({
          users: [currentUserId, likedUserId],
        });
      }
      
      return res.json({ match: true });
    }

    // It's not a match (yet)
    res.json({ match: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getUsers, likeProfile }; // Export the new function

// ... existing imports

// ... existing getUsers and likeProfile functions

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user is attached by our 'protect' middleware
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.age = req.body.age || user.age;
    user.gender = req.body.gender || user.gender;
    user.bio = req.body.bio || user.bio;
    user.interests = req.body.interests || user.interests;
    // Add profile photo update logic here in the future if needed

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: req.headers.authorization.split(' ')[1], // Send back the same token
      // Also send back other details so the frontend can update its state
      age: updatedUser.age,
      gender: updatedUser.gender,
      bio: updatedUser.bio,
      interests: updatedUser.interests,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Add the new functions to the export
module.exports = { getUsers, likeProfile, getUserProfile, updateUserProfile };