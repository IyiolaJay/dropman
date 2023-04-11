const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer");
const isAuth = require("../middlewares/auth");
const { body } = require("express-validator");
//TODO #all routes should be coded below this line;

router.post(
  "/request",
  isAuth,
  [
    body("pickUp", "Enter a valid pickup address")
      .not()
      .isEmpty()
      .custom((value) => {

        if (!value.coordinates || !Array.isArray(value.coordinates)) {
         throw new Error("Invalid Pickup data");
        }

        if (value.coordinates.length !== 2) {
          throw new Error("Coordinates should include longitude and latitude");
        }
        return true;
      }),
  ],
  customerController.requestDropman
);

module.exports = router;
