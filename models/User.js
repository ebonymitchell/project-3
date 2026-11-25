const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema with validation
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        select: false
    }
});

// Hash the password before saving if it has been modified
userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

// Compare the provided password with the stored hash
userSchema.methods.isCorrectPassword = async function (password) {
    if (!this.password) {
        return false;
    }

    return bcrypt.compare(password, this.password);
};

// Create and export the User model
const User = model('User', userSchema);

module.exports = User;