require("dotenv").config();
const Requests = require("../models/dropmanRequests");
const OTPmodal = require("../models/otp");
const Order = require("../models/order");
const { checkValidationError } = require("../utils/helper");
const AfricasTalking = require("africastalking");
const { createOtpToken } = require("../services/tokenService");

const africasTalking = new AfricasTalking({
  apiKey: process.env.AFRICAS_TALKING_APIKEY,
  username: process.env.AFRICAS_TALKING_USERNAME,
});

//
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
      rideType: rideType,
      riderId: null,
    }).populate("customerId");

    if (nearbyRides.length === 0) {
      return res.status(204).json({
        success: true,
        message: "No ride/rideType within the given range",
      });
    }

    // console.log("Checking :",nearbyRides);

    const rides = nearbyRides.map((rides) => {
      return {
        _id: rides._id,
        pickUp: rides.pickUp,
        delivery: rides.delivery.address,
        customerId: rides.customerId._id,
        customerName:
          rides.customerId.firstName + " " + rides.customerId.lastName,
      };
    });

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

exports.acceptRequest = async (req, res, next) => {
  const requestId = req.params.requestId;
  const riderId = req.user;

  try {
    const request = await Requests.findOne({
      _id: requestId.toString(),
    });

    if (!request) {
      const err = new Error("No request found");
      err.statusCode = 404;
      throw err;
    }

    if (
      request.requestStatus === "accepted" ||
      request.requestStatus === "delivered" ||
      request.requestStatus === "transit"
    ) {
      const err = new Error("This request already has a rider");
      err.statusCode = 406;
      throw err;
    }

    if ((await Requests.findOne({ _id: requestId.toString() }).count()) >= 3) {
      const err = new Error(
        "This rider cannot accept more requests at this time"
      );
      err.statusCode = 406;
      throw err;
    }

    request.riderId = riderId.toString();
    request.requestStatus = "accepted";

    const rides = await request.save();
    // const rideDetails = await
    const requestFullDetails = await Requests.findOne({
      _id: rides._id,
    })
      .populate("riderId", "firstName lastName phoneNumber")
      .populate("customerId", "firstName lastName phoneNumber");

    return res.status(200).json({
      success: true,
      rideDetails: requestFullDetails,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.completeDelivery = async (req, res, next) => {
  try {
    const requestId = req.body.requestId;

    const request = await Requests.findOne({
      _id: requestId,
      riderId: req.user,
    });

    console.log(request.delivery.address.recipientPhone);

    if (!request) {
      const err = new Error("Request not found");
      err.statusCode = 404;
      throw err;
    }

    const token = createOtpToken();
    

    const newToken = new OTPmodal({
      userId: req.user,
      token: token,
      requestId: requestId,
    });

    await newToken.save();

    const sms = africasTalking.SMS;

    await sms.send({
      to: request.delivery.address.recipientPhone,
      message: `Use this token to verify your delivery ${token}, it expires in 15minutes`,
    });

    return res.status(200).json({
      success : true,
      message : 'Sms sent'
    })

   
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.confirmDelivery = async(req, res, next)=>{
  try{
    const token = req.body.otp;
    const requestId = req.body.requestId

    const isToken = OTPmodal.findOne({token : token, requestId : requestId})
    if(isToken){
     const completedRequest = Requests.findOne({_id : requestId})
     completedRequest.requestStatus = "delivered"
      
     await completedRequest.save();

     const order = new Order({
        requestData : completedRequest
      })

      await order.save();
    }

    return res.status(200).json({
      success : true,
      message : "Request completed"
    })
  }catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}