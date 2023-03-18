const User = require("../models/users");
const { validationResult } = require("express-validator");
const {
  genHashedPassword,
  verifyPassword,
} = require("../services/authServices");

//utility function for validation
const checkValidationError = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }
};


//@description : create user account
//@route :  = /auth/create
//@access : public
exports.postCreateAccount = async (req, res, next) => {
  const userType = req.query.userType;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phoneNumber = req.body.phoneNumber;
  const address = req.body.address;
  const email = req.body.email;
  const password = req.body.password;
  const sendEmail = req.query.email;


  if(req.body.metaData && req.body.metaData.rideType){
  const rideType = req.body.metaData.rideType;
  }

  let user;
  try {
    checkValidationError(req);

    const checkUser = await User.findOne({ email: email });
    console.log(checkUser);
    
    if (checkUser) {
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

    

    //TODO send email to user after creation 

    res.status(201).json({
      message: "Account successfully created",
      user: createUser,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
