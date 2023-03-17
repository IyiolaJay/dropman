require('dotenv').config()
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')



exports.genHashedPassword = async(password) => {
    const hashedPassword = await bcrypt.hash(password, 12)
    return hashedPassword;
}

exports.verifyPassword = async(enteredPassword, password) =>{
    const results = await bcrypt.compare(enteredPassword, password)
    return results;
}

exports.createJwt = (payload, secret)=> {
    return jwt.sign(payload, process.env.JWT_SECRET);
}