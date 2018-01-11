'use strict'


var express = require('express'),
	router = express.Router(),
	controller = require('./wallet.controller');

router.post('/setString', controller.setString);
router.post('/getString', controller.getString);
router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.post('/generateQR', controller.generateQR);
router.post('/getStringByuser', controller.getStringByuser);
module.exports = router;
