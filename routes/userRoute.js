const express = require("express");

const {
  registerBusiness,
  registerInvestor,
  login,
  auth,
} = require("../utils/auth");

const userRoute = express.Router();

userRoute.post('/registerInvestor', registerInvestor);
userRoute.post('/registerBusiness', registerBusiness);
userRoute.post('/login', login);


module.exports ={
    userRoute
}
