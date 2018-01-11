'use strict'
var web3_extended = require('web3_extended');
var crypto = require('crypto');
const fs = require('fs');
const nodemailer = require('nodemailer');
var QRCode = require('qrcode');
var QrCodeReader = require('qrcode-reader');
var QrR = new QrCodeReader();
var options = {
	host: 'http://localhost:8545',
	ipc: false,
	personal: true,
	admin: false,
	debug: false
};

var web3 = web3_extended.create(options);
var abi = [{"constant":false,"inputs":[{"name":"name","type":"bytes32"},{"name":"email","type":"bytes32"},{"name":"phn","type":"uint256"}],"name":"reg","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getId","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"bytes32"},{"name":"index","type":"uint256"}],"name":"getForm","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"MedicalInfo","type":"string"},{"name":"id","type":"bytes32"},{"name":"index","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
var address = "0xbe114322e7d8466911b6463e58bb1eb75fcbeedd";
var myContract = web3.eth.contract(abi).at(address);

exports.setString = function (req, res) {
	var data = myContract.set.getData(req.body.str,req.body.id,req.body.index);
	var from = "0x471b6e57d2505d57929707d3a7d6d5eda49b64dc";
	web3.eth.sendTransaction({ to: address, from: from, gas: 4572729, data: data }, function (err1, resp1) {
		if (err1) {
			err1 = err1.toString().replace("Error:", "");
			console.log("The error is " + err1)
			return res.json({ success: "false", "data": [{ "message": err1 }] });
		}
		else {
			var Interval = setInterval(function () {
				web3.eth.getTransactionReceipt(resp1, function (err2, res2) {
				  if (err2) return res.json({status:300});
				  if (res2 != null || res2 != undefined) {
					clearInterval(Interval);
					return res.json({ status: 200, res: res2 });
				  }
				});
			},4000);
		}
	});
}

exports.login = function (req, res) {
	var sql = 'SELECT * FROM users WHERE email = ?'
	global.con.query(sql, [req.body.email], function (err, result) {
	  if (err) return res.send(err);
  
	  if (result.length > 0) {
		var login_attempt_hashed = crypto.createHash('md5').update(req.body.password).digest('hex');
		if (result[0].password.trim() == login_attempt_hashed) {
		  return res.json({ status: 200, res: result });
		} else {
		  return res.json({ status: 300, res: result });
		}
	  } else {
		return res.json({ status: 300, res: result });
	  }
	});
}

exports.signup = function (req, res) {
	var data = myContract.reg.getData(req.body.name,req.body.email,req.body.phone);
	var from = "0x471b6e57d2505d57929707d3a7d6d5eda49b64dc";
	web3.eth.sendTransaction({ to: address, from: from, gas: 2172729, data: data }, function (err1, resp1) {
		if (err1) {
			err1 = err1.toString().replace("Error:", "");
			console.log("The error is " + err1)
			res.json({ success: "false", "data": [{ "message": err1 }] });
			return res;
		}
		else {
			var Interval = setInterval(function () {
				web3.eth.getTransactionReceipt(resp1, function (err2, res2) {
				  if (err2) return;
				  if (res2 != null || res2 != undefined) {
					clearInterval(Interval);
					myContract.getId(function (err3, res3) {
						var BlockChainID = res3[res3.length-1];
						var password = crypto.createHash('md5').update(req.body.password).digest('hex');
						var sql = "INSERT INTO users (name, email, phone, password, blockchain_id,type) VALUES ?";
						var values = [[req.body.name,req.body.email,req.body.phone,password,BlockChainID,req.body.type],];
					
						global.con.query(sql,[values],function(err,result) {
						  if(err) return res.send(err);
					
						  if(result.affectedRows==1) {
							return res.json({status:200,res:'User Inserted'});
						  }else{
							return res.json({status:300});
						  }
						});
					});
				  }
				});
			},4000);
		}
	});
}

exports.getStringByuser = function (req, res) {
	myContract.getForm(req.body.id,req.body.index,function (err1, res1) {
		if (err1) {
			return res.json({ "error": true, data: err1 });
		} else {
			return res.json({ "error": false, data: res1 });
		}
	});
}

exports.getString = function (req, res) {
	getstringAsync(req,res).then(function(error,response) {
		if(error) return res.send(error);
		return res.send(response);
	});
}

var getstringAsync = function(req, res) {
	return new Promise(function(resolve,reject) {
		var sql = "SELECT * FROM  qr_mapping WHERE qr_code = ?";
		var values = [[req.body.qrhash],];
		global.con.query(sql,[values],function(err,result) {
			if(err) reject(err);
			if (result.length > 0) {
				var now = new Date();
				var then = new Date(result[0].expire_date);
				if(now.getTime()<then.getTime()) {
					var data1,data2,data3,data4,p1,p2,p3,p4;
					var arr= [];
					if(result[0].general_info==1) {
						p1 = new Promise((resolve1, reject1) => {
							myContract.getForm(result[0].user_blockchain_id,0,function (err1, res1) {
								if (err1) {
									reject1(err1);
								} else {
									resolve1(data1=res1);
								}
							});
						}); 
						arr.push(p1);
					}
					if(result[0].present_info==1) {
						p2 = new Promise((resolve2, reject2) => {
							myContract.getForm(result[0].user_blockchain_id,3,function (err1, res1) {
								if (err1) {
									reject2(err1);
								} else {
									resolve2(data2=res1);
								}
							});
						});
						arr.push(p2);
					}
					if(result[0].past_info==1) {
						p3 = new Promise((resolve3, reject3) => {
							myContract.getForm(result[0].user_blockchain_id,1,function (err1, res1) {
								if (err1) {
									reject3(err1);
								} else {
									resolve3(data3=res1);
								}
							});
						});
						arr.push(p3);
					}
					if(result[0].other_info==1) {
						p4 = new Promise((resolve4, reject4) => {
							myContract.getForm(result[0].user_blockchain_id,2,function (err1, res1) {
								if (err1) {
									reject4(err1);
								} else {
									resolve4(data4=res1);
								}
							});
						});
						arr.push(p4);
					}
					Promise.all(arr).then(values => { 
						resolve({d1:data1,d2:data2,d3:data3,d4:data4});
					});
				}
			}else{
				reject("no data found");
			}
		});
	});
}

exports.generateQR = function (req, res) {
	var qrhash = crypto.createHash('md5').update(req.body.toString()).digest('hex');
	QRCode.toDataURL(qrhash, function (err, data_url) {
    if (err) {
        res.json({ success: false, message: "error", err })
    } else {	
	var img = data_url;
	var data = img.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer(data, 'base64');
	var name = '5566555';
	fs.writeFile(__dirname+'/'+name+'.png', buf);
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "vishant.singh@sofocle.com",
            pass: "prolitusvishant"
        }
     });
     var mailOptions = {
        from: '<vishant.singh@sofocle.com>',
        to: "vishant.singh@sofocle.com",
        subject: 'QR Code', 
	attachments: [
        { 
            filename: '5566555.png',
            content:  fs.createReadStream(__dirname +'/5566555.png')
        }]
     };
     transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }else{
					var d = new Date();
					d.setDate(d.getDate()+1);
					var sql = "INSERT INTO qr_mapping(qr_code,user_id,expire_date,general_info,present_info,past_info,other_info,user_blockchain_id) VALUES ?";
					var values = [[qrhash,req.body.id,d,req.body.generalinfo,req.body.presenthtry,req.body.pasthstry,req.body.other,req.body.b_id],];
				
					global.con.query(sql,[values],function(err,result) {
						if(err) return res.send(err);
				
						if(result.affectedRows==1) {
							return res.json({status:200,res:info.response});
						}else{
						return res.json({status:300});
						}
					});
				}
     });
    }
});
}