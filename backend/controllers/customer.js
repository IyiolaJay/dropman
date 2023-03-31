require("dotenv").config();
const User = require("../models/users");
const Request = require("../models/dropmanRequests");
const { calculateAmount } = require("../utils/helper");
const { checkValidationError } = require("../utils/helper");



// @description : Create ride request
// @route :  = /customer/request
// @access : requires authorization
exports.requestDropman = async (req, res, next) => {
  const pickUp = req.body.pickUp;
  let delivery = req.body.delivery;
  const rideType = req.body.rideType;

  console.log(pickUp);

  if (!Array.isArray(delivery)) {
    delivery = [delivery];
  }
  try {
    if (req.userType !== "customer") {
      const err = new Error(
        "Riders cannot make request with a Rider's account"
      );
      err.statusCode = 403;
      throw err;
    }
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
        !check.address.coordinates ||
        !check.recipientName ||
        !check.recipientPhone
      ) {
        const err = new Error(
          "Delivery data incomplete must include coordinates, recipientName, recipientPhone"
        );
        err.statusCode = 406;
        throw err;
      }
    });


    const geoKeys = { pickUp: {}, delivery: [] };

    if (pickUp) {
      geoKeys.pickUp = {
        type: "Point",
        coordinates: [pickUp.coordinates[0], pickUp.coordinates[1]],
      };
    }

    if (delivery) {
      geoKeys.delivery = delivery.map((del) => {
        return {
          address: {
            type: "Point",
            coordinates: [
              del.address.coordinates[0],
              del.address.coordinates[1],
            ],
          },
          recipientName: del.recipientName,
          recipientPhone: del.recipientPhone,
        };
      });
    }

    // Returns the price per kilometer.
    const amount = calculateAmount(
      geoKeys.pickUp.coordinates,
      geoKeys.delivery
    );

    // counting the current user's total number of request in the database
    const findUserCount = await Request.find({
      customerId: req.user,
    }).countDocuments();

    if (findUserCount > 3) {
      const error = new Error("Users are limited to 3 requests in total");
      error.statusCode = 401;
      throw error;
    }
    console.log(geoKeys);

    const request = new Request({
      customerId: req.user,
      pickUp: geoKeys.pickUp,
      delivery: geoKeys.delivery,
      amount: amount,
      rideType: rideType,
    });

    const val = await request.validate();
    console.log("Validation of schema", val);

    const savedReq = await request.save();

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
