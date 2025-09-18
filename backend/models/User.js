const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@nitm\.ac\.in$/,
            'Please provide a valid NIT Meghalaya email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false, // Prevents password from being sent in queries by default
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    interests: {
        type: [String], // An array of strings
    },
    profilePhotoUrl: {
        type: String,
        default: '/default-avatar.png', // A default placeholder image
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    // --- Fields for Matching Logic ---
    likedProfiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    passedProfiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// --- Mongoose Middleware to Hash Password Before Saving ---
userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password with a cost factor of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;