var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var jwt  = require('jsonwebtoken'); 


var condb = require('../condb');
var connection = mysql.createConnection(condb);



/////////   logic //////////////////////

var upHouse =function(){
	var sql = "UPDATE house t SET t.xgis = t.xgis*1 , t.ygis = t.ygis*1";
	connection.query(sql,function (err, result) {
		if(err)console.log(err);
		var sql = "UPDATE house t SET t.xgis = NULL , t.ygis = NULL WHERE t.xgis = 0 or t.ygis = 0";
		connection.query(sql,function(err,result){
			if(err)console.log(err);
		});
	});
};

router.get('/updatehouse',function(req,res){
	upHouse();
	res.send("update x,y on house success!.")
})

router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/maptest', function(req, res, next) {
	res.render('maptest');
});

router.get('/test',function(req,res){
	var sql ='select username,fullname from user limit 3';
	connection.query(sql, function (err, result, fields) {
		if(err) throw err;
		res.json({'data':result})
		
	})
	
});

router.post('/add',function(req,res){
	var updata = req.body;
	console.log(updata);
	var sql = "update house set xgis="+updata.xgis+",ygis="+updata.ygis +" where hcode= '"+updata.hcode+"'";
	connection.query(sql,[updata],function(err,result){
		if (err) console.log(err);
		res.json({'save':'ok'})

	});

	//res.json(req.body)
})



router.get('/house',function(req,res){
	var sql = "SELECT t.hcode,t.hno,v.villname,RIGHT(t.villcode,2) villno";
	sql+= " ,t.ygis lat,t.xgis lng FROM house t LEFT JOIN village v on v.villcode = t.villcode";
	var houseCollection=  {
		"type": "FeatureCollection",
		"name": "house",
		"features":[]
	};
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		result.forEach(function(row){
			houseCollection.features.push({
				"type": "Feature",
				"properties": { 
					'hcode':row.hcode,
					'hno':row.hno,
					'villno':row.villno,
					'villname':row.villname, 
					'title': row.hno +' หมู่ '+row.villno +' บ.'+row.villname, 
					'marker-symbol':'warehouse',  
					'marker-color':'#0000FF',

					
				},
				"geometry": { "type": "Point", "coordinates": [JSON.parse(row.lng),JSON.parse(row.lat)] } 
			})
		});//end Loop
		res.json(houseCollection);
	});

})

router.get('/auth', function(req, res) {
	
		var token = jwt.sign('tehnn', '1234');
        res.send(token)
	
});

module.exports = router;
