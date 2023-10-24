const express = require("express");
const {
  fundWallet,
  invest,
  withdraw,
} = require("../controllers/walletController");
const {auth} = require("../utils/auth.js")
const walletRoute = express.Router();

walletRoute.post("/fundWallet/:userId/:walletId", auth, fundWallet );
walletRoute.post("/invest/:userId/:groupId", auth, invest);
walletRoute.post("/withdraw", auth, withdraw);

module.exports ={
    walletRoute,
}