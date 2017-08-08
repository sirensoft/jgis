var express = require('express');
var router = express.Router();
var mysql = require('mysql');



var condb = require('../condb');
var connection = mysql.createConnection(condb);
var authen = require('../authen');



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

router.get('/',authen.check,function(req, res, next) {
	res.render('index');
});

router.get('/maptest', function(req, res, next) {
	res.render('maptest');
});

router.get('/test',function(req,res){
	var sql ='select count(*) user from user where username =? and password=? limit 1';
	connection.query(sql,['adm','mda'] ,function (err, result, fields) {
		if(err) throw err;
		var json = [];
		result.forEach(function(row){
			json.push({data:row});
		});
		res.json(json[0].data.user);
		
		
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



router.get('/adl',function(req,res){
	var adlCollection=  {
		"type": "FeatureCollection",
		"name": "adl",
		"features":[]
	};

	var sql = "SELECT p.fname,p.hcode,h.hno,RIGHT(v.villcode,2) villno,v.villname\n" +
",h.ygis lat,h.xgis lng from f43specialpp  t\n" +
"LEFT JOIN person p ON p.pid = t.pid\n" +
"LEFT JOIN house h ON h.hcode = p.hcode\n" +
"LEFT JOIN village v on h.villcode = v.villcode\n" +
"WHERE t.ppspecial= '1b1282'";
connection.query(sql,function(err, result, fields){
	if(err) throw err;
	result.forEach(function(row){
		adlCollection.features.push({
			"type": "Feature",
				"properties": { 
					'hcode':row.hcode,
					'hno':row.hno,
					'villno':row.villno,
					'villname':row.villname, 
					'title': row.hno +' หมู่ '+row.villno +' บ.'+row.villname, 
					'marker-symbol':'disability',  
					'marker-color':'#FF4500',

					
				},
				"geometry": { "type": "Point", "coordinates": [JSON.parse(row.lng),JSON.parse(row.lat)] } 
		});
	})//loop
	res.json(adlCollection)

})// query

})//get

module.exports = router;
