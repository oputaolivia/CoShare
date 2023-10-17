const express = require("express");
const upload = require("../utils/cloudinary");

const {
  createGroup,
  updateGroup,
  updateGroupImage,
  joinGroup,
  leaveGroup,
  deleteGroup,
} = require("../controllers/groupController");
const { auth } = require("../utils/auth");

const groupRoute = express.Router();
const uploadFields = [
  {
    name: "groupImage",
    maxCount: 1,
  },
];

groupRoute.post("/create", auth, upload.fields(uploadFields), createGroup);
groupRoute.put("/update/:id", auth, updateGroup);
groupRoute.put("/updateImage/:id", auth, upload.fields(uploadFields), updateGroupImage);
groupRoute.put("/join/:id", auth, joinGroup);
groupRoute.put("/leave/:id", auth, leaveGroup);
groupRoute.delete("/delete/:id", auth, deleteGroup);

module.exports = {
  groupRoute,
};
