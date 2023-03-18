const User = require('../models/users')

exports.postRequest = async (req, res, next)=>{
    res.status(201).json({
        message : 'success'
    })
}