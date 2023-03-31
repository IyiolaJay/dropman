const express = require("express");
const Requests = require("../models/dropmanRequests");
const { checkValidationError } = require("../utils/helper");

//@description : view ride request
//@route :  = /rider/view-request
//@access : requires auth
exports.findRequests = async (req, res, next) => {
  // Write code to query the database for request within 3km to the logged in rider
  try {
    // if (!req.body.coordinates) {
    //     const err = new Error("Please include rider location/coordinates");
    //     err.statusCode = 422;
    //     throw err;
    //   }
    checkValidationError(req);

    const riderLocation = req.body.coordinates;

    const nearbyRides = await Requests.find({
      pickUp: {
        $near: {
          $geometry: { type: "Point", coordinates: riderLocation },
          $minDistance: 1000,
          $maxDistance: 5000,
        },
      },
      rideType : "bike",
    });
    console.log(nearbyRides);

    return res.status(200).json({
      success: true,
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }

};
