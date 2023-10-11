const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    businessName: {
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
      default: "Business",
      enum: ["Investor", "Business"],
    },
    websiteUrl:{
        type: String,
    },
    CAC: {
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Business = mongoose.model("business", businessSchema);

module.exports = Business;
