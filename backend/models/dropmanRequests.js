const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const addressSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point",
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const deliveryDataSchema = new Schema({
  address : {
    type : addressSchema,
    require : true,
  },
    recipientName: {
      type: String,
    },
    recipientPhone: {
      type: String,
    },
    trackingNumber: {
      type: Schema.Types.ObjectId,
    },
})

const requestSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  pickUp: {
    type: addressSchema,
    required: true,

  },
  delivery: [
    {
      type: deliveryDataSchema,
      required: true,
    },
  ],

  amount: {
    type: Number,
    required: true,
  },
  requestStatus: {
    type: String,
    enum: ["accepted", "transit", "delivered", "requested"],
    required: true,
    default: "requested"
  },
  riderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  rideType : {
    type : String,
    enum : ["bike", "truck"],
    default : "bike"
  }
  ,
  createdAt: {
    type: Date,
    default: Date.now,
    index: {
      expires: 84600,
    },
  },
});

requestSchema.index({
  "pickUp": "2dsphere",
  "delivery.address": "2dsphere",
});

requestSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7200, partialFilterExpression: { riderId: null } }
);

module.exports = mongoose.model("Request", requestSchema);

