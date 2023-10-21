const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    walletBalance: {
      type: Number,
      default:0,
    },
    walletNumber:{
      type: String,
    },
    walletName:{
      type: String,
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.model("wallet", walletSchema);
module.exports = Wallet;
