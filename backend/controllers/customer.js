const User = require("../models/users");
const Request = require("../models/dropmanRequests");

exports.requestDropman = async (req, res, next) => {
  const pickUp = req.body.pickUp;
  let delivery = req.body.delivery;


  if (!Array.isArray(delivery)) {
    delivery = [delivery];
  }
  try {
    if (delivery.length > 3) {
      console.log(delivery.length);
      const err = new Error("Maximum number of 3 delivery addresses allowed");
      err.statusCode = 406;
      throw err;
    }

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

    const newRequest = new Request({
      customerId: req.user,
      pickUp : pickUp,
      delivery : delivery,
      amount: 2000,
    });

    const savedReq = await newRequest.save();
  

    res.status(201).json({
      message: "success",
      request: newRequest,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
