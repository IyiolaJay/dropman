//TODO define Users schema.
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
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {},

    metaData: {
      rideType: String,
      verificationStatus: {
        type: Boolean,
        required: true,
        default: false,
      },
      verificationToken: String,
      verificationTokenExpiration: String,
      rating: String,
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
    userType: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
