const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  // We can add the last message here later for chat previews
  lastMessage: {
    type: String,
  },
}, {
  timestamps: true,
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;