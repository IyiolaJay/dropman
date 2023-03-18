const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator");
const authorize = require("../middlewares/auth");

//TODO create routes to handle user signup, login, logout.

router.post(
  "/create",
  [
    body("email")
      .isEmail()
      .withMessage("please enter a valid email")
      .normalizeEmail(),
    body("firstName", "Please enter a valid first name")
      .not()
      .isEmpty()
      .isLength({ min: 1 })
      .trim(),
    body("lastName", "Please enter a valid last name")
      .not()
      .isEmpty()
      .isLength({ min: 1 })
      .trim(),
    body("phoneNumber", "Please enter a valid number").not().isEmpty().trim(),
    body("address", "Enter a valid address").not().isEmpty().trim(),
    body(
      "password",
      `Please enter a password of at least 
    6 characters long and contains alphanumeric`
    )
      .isAlphanumeric()
      .isLength({ min: 6 }),
  ],
  authController.postCreateAccount
);

router.post('login');

module.exports = router;
