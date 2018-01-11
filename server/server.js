'use strict';

var express = require('express'),
	mongoose = require('mongoose'),
	http = require('http');
	var path = require('path');

const PORT = 7000;

var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var mysql = require('mysql');
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'vishant@123',
	database: 'hwallet'
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(express.static(path.join(__dirname, '../client/app')));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/app/index.html'));
});

require('./routes')(app);

con.connect(function (err) {
	if (err) return console.log(err);
	server.listen(PORT, function () {
		global.con = con;
		console.log('App Started at Port:' + PORT);
	});
})

exports = module.exports = app;
