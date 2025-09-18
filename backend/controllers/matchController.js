const Match = require('../models/Match');

const getMatches = async (req, res) => {
  try {
    const matches = await Match.find({ users: req.user._id })
      .populate('users', 'name profilePhotoUrl');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getMatches };