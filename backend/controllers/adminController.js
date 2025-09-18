const User = require('../models/User');

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

const banUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isBanned = !user.isBanned; // Toggle ban status
    const updatedUser = await user.save();
    res.json({ message: 'User ban status updated', user: updatedUser });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const verifyUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.emailVerified = true; // Mark as manually verified
    const updatedUser = await user.save();
    res.json({ message: 'User verified', user: updatedUser });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getAllUsers, banUser, verifyUser };