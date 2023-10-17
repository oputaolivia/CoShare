const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: mongoose.Schema.Types.Mixed,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: mongoose.Schema.Types.Mixed,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    userStatus: {
      type: String,
      default: "Investor",
      enum: ["Investor", "Business"],
    },
    referer: { type: String },
    totalRefered: {
      type: Number,
      default: 0,
    },
    profileImage: {
      type: String,
    },
    numGroup: {
      type: Number,
      default: 0,
    },
    numPortfolio: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
