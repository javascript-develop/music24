const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
  },
  userId: {
    type: Number,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
  },
  plan: {
    type: String,
    default: "no", // Default value for plan
  },
  subscriptionStartDate: {
    type: Date,
    default: null,
  },
  subscriptionDuration: {
    type: Number,
    default: 0,
  },
  subscriptionStatus: {
    type: String,
    enum: ["active", "pending", "expired"], // Subscription status options
    default: "pending", // Default value for subscription status
  },
});

// Method to generate JWT token for user authentication
userSchema.methods.getJWTtoken = function () {
  return jwt.sign({ email: this.email }, "DPEEHEOEEPEERUR78USXPEPEEHA", {
    expiresIn: "1h",
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
