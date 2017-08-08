var jwt  = require('jsonwebtoken'); 


module.exports.check=function (req, res, next) {

var token = req.body.token || req.query.token || req.headers['x-access-token'];

// decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'gis', function(err, decoded) {      
      if (err) {
        //return res.json({ success: false, message: 'Failed to authenticate token.' });    
        res.redirect('/login');
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

   res.redirect('/login');

}

  

};