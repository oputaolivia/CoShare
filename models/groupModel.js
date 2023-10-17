const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
    maxNumMembers:{
      type: Number,
      default: 30,
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
