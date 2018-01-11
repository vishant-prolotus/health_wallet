'use strict'

module.exports = function(app) {
	app.use('/wallet', require('./api/wallet/index'));
}