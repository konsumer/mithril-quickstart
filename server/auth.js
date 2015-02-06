/**
 * This includes auth-related API endpoints 
 */

var express = require('express'),
  JWT = require('jwt-async'),
  bodyParser = require('body-parser'),
  urlParse = bodyParser.urlencoded({extended:true}),
  User = require('./models/User.js'),
  Verify = require('./models/Verify.js'),
  jsonParse = bodyParser.json();

var auth = module.exports = express();

var jwt = new JWT({
  crypto: {
    algorithm: 'HS512',
    secret: process.env.TOKEN_SECRET || "NOT A SECRET AT ALL, YOU SHOULD TOTES CHANGE IT"
  }
});


// require an auth-token middleware
auth.requireToken = function(req,res,next){
  var token;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  }

  if (req.body && req.body.token) {
    token = req.body.token;
  }

  if (!token){
    return res.status(401).send({status: 401,message:'Token not set.'});
  }

  jwt.verify(token, function (err, data) {
    if (err){ return res.status(401).send({status: 401,message: err}); }
    req.user = data.claims.user;
    delete req.user.password;
    next();
  });
};

// get JWT token for login credentials
auth.post('/login', [urlParse, jsonParse], function(req, res){
  User.findOne({email:req.body.email}).exec()
    .then(function(user){
      if (user){
        if (!user.verified){
          return res.status(401).send({status: 401,message: 'User not verified.'});
        }
        user.verifyPassword(req.body.password, function(err, isMatch) {
          if (err) { return res.status(500).send({status: 500,message: 'Database error.'}); }
          if (!isMatch) { return res.status(401).send({status: 401,message: 'Bad password.'}); }
          delete user.password;
          jwt.sign({user:user}, function (err, token) {
            if (err) { return res.status(500).send({status: 500,message: err.message}); }
            return res.send({token: token});
          });
          
        });
      }else{
        return res.status(401).send({status: 401,message: 'User not found.'});
      }
    }, function(err){
      return res.status(500).send(err);
    });
});

// register new login credentials
auth.post('/register', [urlParse, jsonParse], function(req, res){
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err, u){
    if (err){
      err.status=500;
      return res.status(500).send(err);
    }
    
    var verify = new Verify({user: user});
    verify.save();

    // TODO: implement a user email here

    console.log('User ' + user.email + ' signed up. Verify with /verify/' + verify.code);

    return res.send({'message':'OK'});
  });
});

// verify a user
auth.post('/verify', [urlParse, jsonParse], function(req,res){
  Verify.findOne({code:req.body.token})
    .exec()
    .then(function(verify){
      if (!verify){
        return res.status(500).send({status: 500,message:'Code not found.'});
      }
      User.findOneAndUpdate({_id:verify.user}, {verified:true}).exec()
        .then(function(){
          verify.remove();
          return res.send({'message':'OK'});
        }, function(err){
          return res.status(500).send(err);
        });
    }, function(err){
      return res.status(500).send(err);
    });
});

// get user info
auth.get('/user', auth.requireToken, function(req, res){
  res.send(req.user);
});

// request a verify-reissue
auth.post('/reissue', [urlParse, jsonParse], function(req,res){
  
});
