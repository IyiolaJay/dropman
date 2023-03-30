const User = require("../models/users");
const { validationResult } = require("express-validator");
const {
  genHashedPassword,
  verifyPassword,
  createJwt,
} = require("../services/authServices");
const { sendToMail } = require("../services/emailServices");
const { checkValidationError } = require("../utils/helper");
const { createTokenHash, createOtpToken } = require("../services/tokenService");

//@description : create user account
//@route :  = /auth/create
//@access : public
exports.createAccount = async (req, res, next) => {
  const userType = req.query.userType;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phoneNumber = req.body.phoneNumber;
  const address = req.body.address;
  const email = req.body.email;
  const password = req.body.password;
  const sendEmail = req.query.email;

  if (req.body.metaData && req.body.metaData.rideType) {
    const rideType = req.body.metaData.rideType;
  }

  let user;
  try {
    checkValidationError(req);

    if (!req.query.userType) {
      const err = new Error("User type must be included");
      err.statusCode = 422;
      throw err;
    }

    const checkUser = await User.findOne({ email: email });

    if (checkUser && checkUser.userType) {
      throw new Error(`User already exists as a ${checkUser.userType}`);
    }

    const Hash = await genHashedPassword(password);
    if (userType === "customer") {
      user = new User({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        address: address,
        email: email,
        password: Hash,
        userType: userType,
      });
    } else {
      user = new User({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        address: address,
        email: email,
        password: Hash,
        metaData: {
          rideType: rideType,
        },
        userType: userType,
      });
    }
    const createUser = await user.save();

    const token = await createTokenHash();

    if (sendEmail !== false) {
      const mailBody = {
        to: email,
        subject: "Welcome, Your account has been created",
        token: token,
        name: createUser.firstName + " " + createUser.lastName,
      };
      await sendToMail(mailBody);
    }

    return res.status(201).json({
      success: true,
      message: "Account successfully created",
      user: createUser,
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyValue) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      err.message = `A user with ${field} "${value}" already exists.`;
      return err;
    }

    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

//@description : login user account
//@route :  = /auth/login
//@access : public
exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    checkValidationError(req);

    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const passwordCompare = verifyPassword(password, findUser.password);
    if (!passwordCompare) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const payload = {
      email: email,
      userId: findUser._id,
      userType: findUser.userType,
    };
    const token = createJwt(payload);
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      token: token,
      user: findUser.email,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.recoverPassword = (req, res, next) => {
  const email = req.body.email;
};
