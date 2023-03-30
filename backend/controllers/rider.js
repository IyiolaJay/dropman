const express = require('express');
const Requests = require('../models/dropmanRequests')


//@description : view ride request
//@route :  = /rider/view-request
//@access : requires auth
exports.getRequests = (req, res , next)=>{
    // Write code to query the database for request within 3km to the logged in rider
}