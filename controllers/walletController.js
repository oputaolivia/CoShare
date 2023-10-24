const Transfer = require("../models/transferModel");
const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Portfolio = require("../models/portfolioModel");

// I need to checkout how to create an account using the momo api

const fundWallet = async (req, res) => {
  try {
    const { userId, walletId } = req.params;
    const { amount, payeeMomoNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).send({
        data: {},
        message: "User not found",
        status: 1,
      });
    }
    const fundWalletResult = await fundWallet(
      user.walletNumber,
      amount,
      payeeMomoNumber
    );

    if (fundWalletResult.error) {
      return res.status(500).send({
        data: {},
        message: "Funding wallet failed",
        status: 1,
      });
    } else {
      const wallet = await Wallet.findById(walletId);

      if (!wallet)
        return res.status(401).send({
          data: {},
          message: `Wallet does not exist`,
          status: 1,
        });

      const total = wallet.walletBalance + amount;
      const updatedWallet = await Wallet.findByIdAndUpdate(
        walletId,
        { walletBalance: total },
        {
          new: true,
        }
      );
      res.status(200).send({
        data: `${updatedWallet}`,
        message: `Wallet Funded`,
        status: 0,
      });
    }
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    });
  }
};

const invest = async (req, res) => {
  try {
    const { userId, groupId } = req.params;
    const { amount } = req.body;

    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).send({
        data: {},
        message: `User not found`,
        status: 1,
      });
    }
    if (!group) {
      return res.status(401).send({
        data: {},
        message: `Group not found`,
        status: 1,
      });
    }

    const fundWalletResult = await fundWallet(
      user.walletNumber,
      amount,
      group.walletNumber
    );
    const portfolio = new Portfolio({
      userId,
      amount,
      groupName: group.groupName
    });
    if (fundWalletResult.error) {
      return res.status(500).send({
        data: {},
        message: "Funding wallet failed",
        status: 1,
      });
    } else {
      const wallet = await Wallet.findOne({walletNumber: group.walletNumber})

      if (!wallet)
        return res.status(401).send({
          data: {},
          message: `Wallet does not exist`,
          status: 1,
        });

      const walletId = wallet._id;
      const total = wallet.walletBalance + amount;
      const updatedGroupWallet = await Wallet.findByIdAndUpdate(
        walletId,
        { walletBalance: total },
        {
          new: true,
        }
      );
      res.status(200).send({
        data: `${updatedGroupWallet}. ${portfolio}`,
        message: `Investment made sucessfully`,
        status: 0,
      });
    }
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    });
  };
};

const withdraw = async(req,res) =>{
  try {
    
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status:1,
    })
  }
}

const groupWithdrawal = async(req, res) =>{
  try {
    
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    })
  }
}

module.exports = {
  invest,
  fundWallet,
  withdraw,
  groupWithdrawal,
};
