const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');

//TODO #all routes should be coded below this line;

router.post('/request', customerController.postRequest);

module.exports = router;