const Fund = require("../models/fundModel");
const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Portfolio = require("../models/portfolioModel");

// I need to checkout how to create an account using the momo api

const fundWallet = async (req, res) => {
  try {
    const { userId, walletId} = req.params;
  const { amount, payeeMomoNumber } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).send({ 
      data: {},
      message: "User not found",
      status:1,
    });
  };
  const fundWalletResult = await fundWallet(user, amount, payeeMomoNumber);

  if (fundWalletResult.error) {
    return res.status(500).send({
      data: {},
      message: "Funding wallet failed",
      status: 1,
    });
  }else{
    const wallet = await Wallet.findById(walletId);

    if(!wallet)
      return res.status(401).send({
        data: {},
        message: `Wallet does not exist`,
        status: 1,
      })

      const total = wallet.walletBalance + amount
      const updatedWallet = await Wallet.findByIdAndUpdate(walletId, {walletBalance: total}, {
      new:true,
    });
    res.status(200).send({
      data: `${updatedWallet}`,
      message: `Wallet Funded`,
      status: 0,
    })
  }
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    })
  }
};

const invest = async (req, res) => {
  const { userId, groupId } = req.params;
  const group = await Group.findById(groupId);
  const user = await User.findById(userId);

  if (!user){
    return res.status(401).send({
      data:{},
      message: `User not found`,
      status: 1,
    });
  }
  if (!group) {
    return res.status(401).send({
      data:{},
      message: `Group not found`,
      status: 1,
    });
  }

  // Create an investment record
  const portfolio = new Portfolio({
    userId: user._id,
    amount,
    
  })
  const investment = {
    user: user._id,
    amount: amount,
  };

  group.investments.push(investment);
  await group.save();

  // Update the user's wallet balance
  user.walletBalance += amount;
  await user.save();

  res.json({ message: "Wallet funded and investment made successfully" });
};

module.exports = {
  invest,
  fundWallet,
}
