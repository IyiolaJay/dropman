const mongoose = require('mongoose');

const Schema = mongoose.Schema

const otpSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    token : {
        type : String,
        require : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        index : {
            expires : 900
        }
    }
});

module.exports = mongoose.model('OTP', otpSchema);
