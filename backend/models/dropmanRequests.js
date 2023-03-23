const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// The data needed for requesting for a dropman ride will have this structure

/*
{
    _id : 1223,
    customerId : 34,
    addresses : {
        pickup : {
            type : 'Point',
            coordinates : [-123.8567695, -123.9460709],
        },
        delivery : [{
            type : 'Point',
            coordinates : [-123.8567695, -123.9460709],
            deliveryData : {
                recipientName : 'Jay Orlando',
                recipientPhoneNumber: '+2348123456789',
                trackingNumber : 1234658
            },
        }],
    },
    amount : 1500,
    requestStatus: accepted,
    riderId : 12344


}
*/
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
  deliveryData: {
    recipientName: {
      type: String,
    },
    recipientPhone: {
      type: String,
    },
    trackingNumber: {
      type: Schema.Types.ObjectId,
    },
  },
});

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
      type: addressSchema,
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
  createdAt: {
    type: Date,
    default: Date.now,
    index: {
      expires: 84600,
    },
  },
});

requestSchema.index({
  "address.pickup": "2dsphere",
  "address.delivery": "2dsphere",
});

requestSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7200, partialFilterExpression: { riderId: null } }
);

module.exports = mongoose.model("Request", requestSchema);
