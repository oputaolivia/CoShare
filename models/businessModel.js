const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    email: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
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
      default: "Business",
      enum: ["Investor", "Business"],
    },
    walletNumber:{
      type: String,
      required: true,
    },
    websiteUrl:{
        type: String,
        required: true,
    },
    cac: {
        type: String,
        required: true,
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

const Business = mongoose.model("business", businessSchema);

module.exports = Business;
