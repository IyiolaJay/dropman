const express = require("express");
const router = express.Router();
const riderController = require("../controllers/rider");
const { body } = require("express-validator");


router.post(
  "/view-request",
  [
    body("coordinates", "Coordinates are not valid")
      .not()
      .isEmpty()
      .custom((value) => {
        if (value.length !== 2) {
          throw new Error("Coordinates should include longitude and latitude");
        }
        return true;
      })
      .custom((value) => {
        if (!value) {
          throw new Error("Please include value for ride type");
        }
        return true;
      }),
    body("rideType", "Enter value for ride type").not().isEmpty().custom(value =>{
      if(value !== 'truck' && value !== 'bike'){
        throw new Error("Ride type can only be truck or bike");
      }
      return true;
    }),
  ],
  riderController.findRequests
);

module.exports = router;
