const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');
const isAuth = require('../middlewares/auth');
const { body } = require('express-validator')
//TODO #all routes should be coded below this line;

router.post('/request', isAuth, [],customerController.requestDropman);

module.exports = router;