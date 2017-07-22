var fs = require('fs');
var http = require('http');
var https = require('https');

var express = require('express');
var app = express();

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(app);



app.get('/',function(req,res){
	res.json({a:1,b:2});
})

httpServer.listen(8081);
httpsServer.listen(8443);