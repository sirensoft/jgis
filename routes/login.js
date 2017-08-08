var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var jwt  = require('jsonwebtoken'); 

var condb = require('../condb');
var conn= mysql.createConnection(condb);


router.get('/',function(req,res){
	res.render('login');
});

router.post('/check', function(req, res) {
	var user = req.body.user,
	pass = req.body.pass,
	token = '';

	conn.query("select count(*) user from user where username =? and password=? limit 1",[user,pass],function(err,result){
		if(err) throw err;

		var json = [];
		result.forEach(function(row){
			json.push({data:row});
		});
		

		if(json[0].data.user==1){				
			token = jwt.sign(user, 'gis');
			res.json({token: token});
		}		
		
	});

	
	
});

module.exports = router;