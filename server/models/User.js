const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
        unique: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    otp: {
        type: String
    },

    otpExpiry: {
        type: Date
    }
})

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;