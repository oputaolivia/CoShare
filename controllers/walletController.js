const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Portfolio = require("../models/portfolioModel");
const { transfer, requestToFundWallet } = require("../utils/paymentHandlers/fundWallet");

// I need to checkout how to create an account using the momo api

const fundWallet = async (req, res) => {
  try {
    const { userId, walletId } = req.params;
    const { amount, payerMomoNumber, description } = req.body;

    const user = await User.findById(userId);
    const wallet = await Wallet.findById(walletId)
    if (!user) {
      return res.status(401).send({
        data: {},
        message: "User not found",
        status: 1,
      });
    };

    if (!wallet) {
      return res.status(401).send({
        data: {},
        message: "Wallet not found",
        status: 1,
      });
    };
    const fundWalletResult = await requestToFundWallet(
      amount,
      payerMomoNumber,
      description,
    );

    if (fundWalletResult.error) {
      return res.status(500).send({
        data: {},
        message: "Request to Fund wallet failed",
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
    const { amount, description } = req.body;

    const group = await Group.findById(groupId);
    const user = await User.findById(userId);
    const userWallet = await Wallet.findOne({
      walletNumber: user.walletNumber,
    });

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

    if (userWallet.walletBalance < amount) {
      return res.status(401).send({
        data: {},
        message: `Insufficient funds`,
        status: 1,
      });
    }

    const transferResult = await transfer(
      amount,
      group.walletNumber,
      description
    );
    if (transferResult.error) {
      return res.status(500).send({
        data: {},
        message: "Funding wallet failed",
        status: 1,
      });
    } else {
      const portfolio = new Portfolio({
        userId,
        amount,
        groupName: group.groupName,
      });
      await portfolio.save();
      const wallet = await Wallet.findOne({ walletNumber: group.walletNumber });

      if (!wallet)
        return res.status(401).send({
          data: {},
          message: `Wallet does not exist`,
          status: 1,
        });
      // update groupwallet amount
      const walletId = wallet._id;
      const total = wallet.walletBalance + amount;
      const updatedGroupWallet = await Wallet.findByIdAndUpdate(
        walletId,
        { walletBalance: total },
        {
          new: true,
        }
      );
      // update group amount
      const groupTotal = group.amount + amount;
      const updateGroup = await Group.findByIdAndUpdate(
        groupId,
        { amount: groupTotal },
        {
          new: true,
        }
      );

      // update userwallet
      const userBalance = userWallet.walletBalance - amount;
      const updateUserBalance = await Wallet.findByIdAndUpdate(
        userWallet._id,
        { walletBalance: userBalance },
        {
          new: true,
        }
      );
      res.status(200).send({
        data:
          updatedGroupWallet + transferResult + updateUserBalance + portfolio,
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
  }
};

const withdraw = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    });
  }
};

const groupWithdrawal = async (req, res) => {
  try {
    const { userId, groupId } = req.params;
    const { description } = req.body;

    const group = await Group.findById(groupId);
    const user = await User.findById(userId);
    const portfolios = await Portfolio.find({
      userId: userId,
      groupId: groupId,
    });
    const groupWallet = await Wallet.findOne({
      walletNumber: group.walletNumber,
    });

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

    for (const portfolio of portfolios) {
      if (portfolio) {
        const userInvestment = portfolio.amount;
        const amount =
          (userInvestment * group.period * group.interest) / (100 * 12);

        if (groupWallet.walletBalance < amount) {
          return res.status(401).send({
            data: {},
            message: `Insufficient funds`,
            status: 1,
          });
        } else {
          const transferResult = await transfer(
            amount,
            user.walletNumber,
            description
          );
          if (transferResult.error) {
            return res.status(500).send({
              data: {},
              message: "transfer failed",
              status: 1,
            });
          } else {
            const portfolio = new Portfolio({
              userId,
              groupId,
              amount,
              groupName: group.groupName,
            });
            await portfolio.save();
            const wallet = await Wallet.findOne({
              walletNumber: group.walletNumber,
            });

            if (!wallet)
              return res.status(401).send({
                data: {},
                message: `Wallet does not exist`,
                status: 1,
              });

            const walletId = wallet._id;
            const total = wallet.walletBalance - amount;
            const updatedGroupWallet = await Wallet.findByIdAndUpdate(
              walletId,
              { walletBalance: total },
              {
                new: true,
              }
            );

            const groupTotal = group.amount - amount;
            const updateGroup = await Group.findByIdAndUpdate(
              groupId,
              { amount: groupTotal },
              {
                new: true,
              }
            );

            // update userwallet
            const userWallet = await Wallet.findOne({ userId: userId });
            const userBalance = userWallet.walletBalance + amount;
            const updateUserBalance = await Wallet.findByIdAndUpdate(
              userWallet._id,
              { walletBalance: userBalance },
              {
                new: true,
              }
            );
            res.status(200).send({
              data: updatedGroupWallet + transferResult + updateUserBalance,
              message: `Money transferred Successfully`,
              status: 0,
            });
          }
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      status: 1,
    });
  }
};

module.exports = {
  invest,
  fundWallet,
  withdraw,
  groupWithdrawal,
};
