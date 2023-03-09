require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const customerRoutes = require("./routes/customer");
const riderRoutes = require("./routes/rider");
const adminRoutes = require("./routes/admin");

const app = express();
const URI = process.env.MONGODB_URI;

app.use(bodyParser.json());

app.use("/customer", customerRoutes);
app.use("rider", riderRoutes);
app.use("/admin", adminRoutes);


mongoose
  .connect(URI)
  .then((result) => {
    app.listen(3000);
    console.log("Connected Successfully");
  })
  .catch((err) => {
    console.log("Error Occurred:  ", err);
  });
