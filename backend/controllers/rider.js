const express = require("express");
const Requests = require("../models/dropmanRequests");
const { checkValidationError } = require("../utils/helper");

//@description : view ride request
//@route :  = /rider/view-request
//@access : requires auth
exports.findRequests = async (req, res, next) => {

  try {
    checkValidationError(req);

    const riderLocation = req.body.coordinates;
    const rideType = req.body.rideType;


    const nearbyRides = await Requests.find({
      pickUp: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: riderLocation,
          },
         $maxDistance: 4000,
        },
      },
      rideType: rideType

    });

    if (nearbyRides.length === 0){
      return res.status(204).json({
        success: true,
        message: "No ride/rideType within the given range",
      });
    }

    const rides = nearbyRides.map(rides=>{
      return {
        _id : rides._id,
        pickUp : rides.pickUp,
        delivery : rides.delivery.address,
        customer : rides.customerId,
      }
    })



    return res.status(200).json({
      success: true,
      requests: rides,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
