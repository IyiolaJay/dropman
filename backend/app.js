require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const customerRoutes = require("./routes/customer");
const helmet = require("helmet");
const compression = require("compression");

const riderRoutes = require("./routes/rider");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const app = express();
const URI = process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

//Cors Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PATCH, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//Routes registrations
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/rider", riderRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "App is live and running",
  });
});

//error handler middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({
    success: false,
    message: message,
  });
  // next();
});

mongoose
  .connect(URI)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
    console.log(`Connected Successfully to port ${process.env.PORT || 3000}`);
  })
  .catch((err) => {
    console.log("Error Occurred:  ", err);
  });
