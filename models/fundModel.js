const mongoose = require("mongoose");

const fundSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
    },
    amount: {
      type: Number,
    },
    payeeMoMoNumber: {
      type: Number,
    },
  },
  { timestamps }
);

const Fund = mongoose.model("fund", fundSchema);

module.exports = Fund;
