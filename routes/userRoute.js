const express = require("express");
const upload = require("../utils/cloudinary");

const {
  registerBusiness,
  registerInvestor,
  login,
  auth,
  requestPasswordReset,
  resetPassword,
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

const uploadFields = [{ 
  name: "cac", 
  maxCount: 1 
},
{
  name: "profileImage",
  maxCount: 1
}];

userRoute.post("/registerInvestor", registerInvestor);
userRoute.post(
  "/registerBusiness",
  upload.fields(uploadFields),
  registerBusiness
);
userRoute.post("/login", login);

userRoute.get("/getInvestors", auth, getInvestors);
userRoute.get("/getBusinesses",auth, getBusinesses);
userRoute.get("/getInvestor/:id",auth, getInvestor);
userRoute.get("/getBusiness/:id",auth, getBusiness);

userRoute.put("/updateInvestor/:id", auth, upload.fields(uploadFields), updateInvestor);
userRoute.put("/updateBusiness/:id", auth, upload.fields(uploadFields), updateBusiness);
userRoute.delete("/deleteUser/:id", auth, deleteUser);

userRoute.post("/requestPasswordReset/:id", requestPasswordReset);
userRoute.post("/resetPassword", resetPassword);

module.exports = {
  userRoute,
};
