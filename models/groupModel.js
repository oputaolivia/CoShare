const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Business",
    },
    groupName: {
      type: String,
    },
    groupDescription: {
      type: String,
    },
    groupImage: {
      type: String,
    },
    numMembers: {
      type: Number,
      default: 1,
    },
    amount :{
      type: Number,
      default:0,
    },
    walletNumber:{
      type: String,
      required: true,
    },
    amountPerUnit:{
      type: Number,
    },
    units:{
      type: Number,
    },
    maxUnits:{
      type: Number,
    },
    interest:{
      type: Number,
    },
    period:{
      type: Number,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("group", groupSchema);

module.exports = Group;
