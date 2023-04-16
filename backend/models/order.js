const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  requestData: {
    type: Object,
    require: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
