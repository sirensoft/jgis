var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
var condb = require('../condb');
var connection = mysql.createConnection(condb);

/////////   logic //////////////////////

router.get('/favicon.ico', function(req, res) {
    res.status(204);
});
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
	var sql = "update house set xgis="+updata.xgis+",ygis="+updata.ygis +" where hcode= '"+updata.hcode+"'";
	connection.query(sql,[updata],function(err,result){
		if (err) throw err;
		res.json({'save':'ok'})

	});

	//res.json(req.body)
})

router.get('/write',function(req,res){
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

	fs.writeFile('house.json', houseCollection, function (err) {
  	if (err) return console.log(err);
  		console.log('Hello World > helloworld.txt');
	});
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

module.exports = router;
