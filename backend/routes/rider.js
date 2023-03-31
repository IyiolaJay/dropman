const express = require("express");
const router = express.Router();
const riderController = require("../controllers/rider");
const { body } = require("express-validator");

// TODO #all routes should be coded below this line;

router.post(
  "/view-request",
  [
    body("coordinates", "Coordinates are not valid")
      .not()
      .isEmpty()
      .custom((value) => {
        if(value.length !== 2){
            throw new Error('Coordinates should include longitude and latitude')
        }
        return true;
      }),
  ],
  riderController.findRequests
);

module.exports = router;
