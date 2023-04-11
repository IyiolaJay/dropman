//TODO should handle the following data :
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduledSchema = new Schema (
    {
        customerId: {
            type: Number,
            required: true
        },
        addresses: {
            pickUp: {
                type: {
                    type: String,
                    enum: ['Point'],
                    required: true
                },
                coordinates: {
                    type: [Number],
                    required: true
                }
            },
            delivery: [{
                type: {
                    type: String,
                    enum: ['Point'],
                    required: true
                },
                coordinates: {
                    type: [Number],
                    required: true
                } ,
                deliveryData: {
                    recipientName: {
                        type: String,
                        required: true
                    },
                    recipientPhoneNumber: {
                        type: String,
                        required: true                        
                    },
                    trackingNumber: {
                        type: Number,
                        required: true
                    }
                }               
            }]
        },
        amount: {
            type: Number,
            required: true
        },
        requestStatus: {
            type: String,
            required: true
        },
        riderId: {
            type: Number
        },
        scheduledDate: {
            type: Date,
            required: true
        }
    }
);

module.exports = mongoose.model("Scheduled", scheduledSchema);