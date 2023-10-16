const express = require("express");
const upload = require("../utils/cloudinary");

const {
  registerBusiness,
  registerInvestor,
  login,
  auth,
} = require("../utils/auth");
const {
  getBusinesses,
  getInvestor,
  getInvestors,
  getBusiness,
  updateBusiness,
  updateInvestor,
  deleteUser,
} = require("../controllers/usersController");

const userRoute = express.Router();

const uploadCac = [{ 
  name: "cac", 
  maxCount: 1 
}];
const uploadProfileImage =[{
    name: "profileImage",
    maxCount: 1
}]

userRoute.post("/registerInvestor", registerInvestor);
userRoute.post(
  "/registerBusiness",
  upload.fields(uploadCac),
  registerBusiness
);
userRoute.post("/login", login);

userRoute.get("/getInvestors", getInvestors);
userRoute.get("/getBusinesses", getBusinesses);
userRoute.get("/getInvestor/:id", getInvestor);
userRoute.get("/getBusiness/:id", getBusiness);

userRoute.get("/updateInvestor/:id", auth, upload.fields(uploadProfileImage), updateInvestor);
userRoute.get("/updateBusiness", auth, upload.fields(uploadProfileImage), updateBusiness);

module.exports = {
  userRoute,
};
