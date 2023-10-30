const express = require("express");
const {
  invest,
  requestFundWallet,
  acceptFunds,
  withdraw,
  groupWithdrawal,
} = require("../controllers/walletController");
const {auth} = require("../utils/auth.js");
const walletRoute = express.Router();

walletRoute.post("/fundWallet/:userId/:walletId", auth, requestFundWallet );
walletRoute.post("/invest/:userId/:groupId",auth,  invest);
walletRoute.post("/withdraw", auth, withdraw);
walletRoute.post("/groupWithdrawal/:userId/:groupId", auth, groupWithdrawal);
walletRoute.post("/acceptFunds/:userId/:walletId", auth, acceptFunds);

module.exports ={
    walletRoute,
}