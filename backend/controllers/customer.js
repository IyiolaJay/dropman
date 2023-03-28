require('dotenv').config()
const User = require("../models/users");
const Request = require("../models/dropmanRequests");
const {calculateAmount} = require('../utils/helper')
const {checkValidationError} = require('../utils/helper')




//@description : Create ride request
//@route :  = /customer/request
//@access : requires authorization
exports.requestDropman = async (req, res, next) => {
  const pickUp = req.body.pickUp;
  let delivery = req.body.delivery;


  if (!Array.isArray(delivery)) {
    delivery = [delivery];
  }
  try {
    // input data validation
    checkValidationError(req);
    
    //check to see if delivery array elements is not more than 3
    if (delivery.length > 3) {
      console.log(delivery.length);
      const err = new Error("Maximum number of 3 delivery addresses allowed");
      err.statusCode = 406;
      throw err;
    }

    //check to see if the following fields are part of the request body
    delivery.forEach((check) => {
      if (
        !check.coordinates ||
        !check.deliveryData.recipientName ||
        !check.deliveryData.recipientPhone
      ) {
        const err = new Error(
          "Delivery data incomplete must include coordinates, recipientName, recipientPhone"
        );
        err.statusCode = 406;
        throw err;
    }
});

    //Returns the price per kilometer.
    const amount = calculateAmount(pickUp.coordinates, delivery);    

    //counting the current user's total number of request in the database 
    const findUserCount = await Request.find({
      customerId: req.user,
    }).countDocuments();

    if(findUserCount > 3){
        const error = new Error("Users are limited to 3 requests in total");
        error.statusCode = 401;
        throw error;
    }


    const newRequest = new Request({
      customerId: req.user,
      pickUp: pickUp,
      delivery: delivery,
      amount: amount,
    });

    const savedReq = await newRequest.save();

    res.status(201).json({
      message: "success",
      request: savedReq,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
