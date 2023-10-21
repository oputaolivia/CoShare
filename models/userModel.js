const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: mongoose.Schema.Types.Mixed,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
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
    walletNumber:{
      type: String,
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
