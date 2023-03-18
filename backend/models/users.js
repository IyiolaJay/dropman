const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },

    metaData: {
      rideType: { type: String, enum: ["bike", "truck"]},
      verificationStatus: {
        type: Boolean,
        required: true,
        default: false,
      },
      verificationToken: String,
      verificationTokenExpiration: String,
      rating: Number,
    },

    license: String,
    restriction: {
      restricted: Boolean,
      count: String,
      date: String,
      duration: String,
    },
    imageUrl: {
      type: String,
    },
    userType: {
      type: String,
      required: true,
      enum: ["customer", "rider"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
