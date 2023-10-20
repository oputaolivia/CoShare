const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const crypto = require("crypto");
const { sendMail } = require("../helper/mail");
const Token = require("../models/tokenModel");
const Business = require("../models/businessModel");
const Wallet = require("../models/walletModel");

const secretKey = process.env.SECRET;

const registerInvestor = async (req, res) => {
  let { firstName, lastName, email, confPassword, password } = req.body;
  const salt = await bcrypt.genSalt();
  if (password !== confPassword) {
    res.status(400).send({
      data: {},
      message: "Password and Confirm password should match",
      status: 1,
    });
  } else {
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        res.status(400).send({
          data: {},
          message: err,
          status: 1,
        });
      } else {
        const existingUser = await User.findOne({
          email: email,
        });
        if (existingUser) {
          return res.status(400).json({
            data: {},
            message: "Email alresdy exists",
            status: 1,
          });
        }
        const user = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hash,
          confPassword: hash,
        });
        const registedInvestor = await user.save();
        const wallet = new Wallet({
          userId: user._id,
          walletNumber: user.phoneNumber.slice(1),
          walletName: user.firstName + user.lastName,
        });
        const investorWallet = await wallet.save();
        
        res.status(201).send({
          data: `${registedInvestor}, ${investorWallet}`,
          message: "User registered successfully",
          status: 0,
        });
      }
    });
  }
};

const registerBusiness = async (req, res) => {
  let { businessName, email, confPassword, password } = req.body;

  let { cac } = req.files;
  const cacUrl = cac[0].path;
  //console.log(cacUrl)
  const salt = await bcrypt.genSalt();
  if (password !== confPassword) {
    res.status(400).send({
      data: {},
      message: "Password and Confirm password should match",
      status: 1,
    });
  } else {
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        res.status(400).send({
          data: {},
          message: err,
          status: 1,
        });
      } else {
        const existingBusiness = await Business.findOne({
          email: email,
        });
        if (existingBusiness) {
          return res.status(400).json({
            data: {},
            message: "Email alresdy exists",
            status: 1,
          });
        }
        let business = new Business({
          businessName,
          email,
          password: hash,
          confPassword: hash,
          cac: cacUrl,
        });
        const registeredBusiness = await business.save();
        const wallet = new Wallet({
          userId: business._id,
          walletNumber: business.phoneNumber.slice(1),
          walletName: business.businessName,
        });
        const businessWallet = await wallet.save();
        res.status(201).send({
          data: `${registeredBusiness}, ${businessWallet}`,
          message: "Business registered successfully",
          status: 0,
        });
      }
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user =
      (await User.findOne({ email: email })) ||
      (await Business.findOne({ email: email }));
    if (!user) {
      res.status(401).send({
        data: {},
        message: `${email} not found!`,
        status: 1,
      });
    } else if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(500).send({
            data: {},
            message: err,
            status: 1,
          });
        } else if (!result) {
          res.status(401).send({
            data: {},
            message: "Email or password is incorrect",
            status: 1,
          });
        } else {
          const token = jwt.sign({ id: user._id }, secretKey);
          const savedToken = new Token({
            userId: user._id,
            token,
          });
          savedToken.save();
          res.status(200).send({
            data: {
              token,
              id: user._id,
              email: user.email,
            },
            message: "logged in successfully",
            status: 0,
          });
        }
      });
    }
  } catch (err) {
    res.status(500).send({
      data: {},
      error: err.message,
      sataus: 1,
    });
  }
};

const auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .json({ msg: "No authenication token, authorization denied" });

  const verfied = jwt.verify(token, process.env.SECRET);
  if (!verfied)
    return res
      .status(401)
      .json({ msg: "Token verification failed, authorization denied" });

  req.user = verfied.id;
  const user =
    (await User.findById(req.user)) || (await Business.findById(req.user));
  if (!user) return res.status(401).json({ msg: "User doesn't exsist" });

  next();
};

const requestPasswordReset = async (req, res) => {
  let { email } = req.body;

  const user = await User.findOne({ email }) || await Business.findOne({email});
  if (!user) {
    res.status(401).send({
      data: {},
      message: `User with ${email} not found!`,
      status: 1,
    });
  }

  let token = await Token.findOne({
    userId: user._id,
  });
  if (token) await token.deleteOne();
  let resetToken = crypto.randomBytes(32).toString("hex");

  const hash = await bcrypt.hash(resetToken, Number(10));

  await new Token({
    userId: user.id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `localhost://${PORT}/passwordReset?token=${resetToken}&id=${user._id}`;
  sendMail(
    user.email,
    "Password Reset Request",
    { name: user.firstName, link: link },
    "../helper/template/requestResetPassword.hbs"
  );
  res.status(200).send({
    data: {
      token: token,
      userId: user._id,
      link: link,
    },
    message: "Reset Password Successful",
    status: 0,
  });
};

const resetPassword = async (req, res) => {
  let { userId, token, password } = req.body;
  let passwordResetToken = await Token.findOne({ userId });

  if (!passwordResetToken) {
    throw new Error("Invalid or Expired password reset token");
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (isValid) {
    throw new Error("Invalid or Expired password reset token");
  }

  const hash = await bcrypt.hash(password, Number(10));
  await User.updateOne({ _id: userId }, { password: hash });

  const user = await User.findById({
    _id: userId,
  });

  sendMail(
    user.email,
    "Password Reset Successfully",
    { name: user.firstName },
    "../helper/template/resetPassword.hbs"
  );
  await passwordResetToken.deleteOne();
  res.status(200).send({
    data: {
      _id: userId,
      password: hash,
    },
    message: "Password Reset successfully",
    status: 0,
  });
};

module.exports = {
  registerInvestor,
  registerBusiness,
  login,
  auth,
  requestPasswordReset,
  resetPassword,
};
