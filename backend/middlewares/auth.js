require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    const err = new Error(
      'Not Authenticated. Please include authorization header & should start with "Bearer" '
    );
    err.statusCode = 401;
    throw err;
  }

  const authToken = authHeader.split(" ")[1];
  let isJwtValid;

  try {
    isJwtValid = jwt.verify(authToken, process.env.JWT_SECRET);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  if (!isJwtValid) {
    const err = new Error("Not Authenticated. Invalid or expired token");
    err.statusCode = 401;
    throw err;
  }
  req.user = isJwtValid.userId;
  req.userType = isJwtValid.userType;
  next();
};
