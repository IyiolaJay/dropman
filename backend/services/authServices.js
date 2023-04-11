require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.genHashedPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

exports.verifyPassword = async (enteredPassword, password) => {
  const results = await bcrypt.compare(enteredPassword, password);
  return results;
};

exports.createJwt = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "20h" });
};
