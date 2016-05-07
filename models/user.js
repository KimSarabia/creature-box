'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');

const JWT_SECRET = process.env.JWT_SECRET;

var User;

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

userSchema.statics.authMiddleware = function(req, res, next) {
  var token = req.cookies.usercookie;
  try {
    var payload = jwt.decode(token, JWT_SECRET);
  } catch(err) {
    return res.clearCookie('usercookie').status(401).send();
  }
  // we have a valid token
  User.findById(payload.userId, function(err, user) {
    if(err || !user) {
      return res.clearCookie('usercookie').status(401).send(err);
    }
    // the user exists!
    user.password = null;
    req.user = user; // making the user document availble to the route
    next(); // everything is good, and the request can continue
  })//.select({password: 0}); //don't include the password in the db query
};

//schema.statics ---> model method (class method)    User.find() User.authenticate()
//schema.methods ---> instance method (document method)    user.save() user.generateToken() one document
userSchema.methods.generateToken = function() {
  //this is the document you are calling the method on
  var payload = {
    userId: this._id,
    iat: Date.now()  // issued at time
  };
  // generate a token
  var token = jwt.encode(payload, JWT_SECRET);
  return token;
};

userSchema.statics.authenticate = function(userObj, cb) {
  User.findOne({username: userObj.username}, function(err, dbUser) {
    if(err || !dbUser) {
      return cb("Authentication failed.");
    }
    bcrypt.compare(userObj.password, dbUser.password, function(err, isGood) {
      if(err || !isGood) {
        return cb("Authentication failed.");
      }
      dbUser.password = null;
      cb(null, dbUser);
    });
  });
};



userSchema.statics.register = function(userObj, cb) {
  bcrypt.hash(userObj.password, 10, function(err, hash) {
    if(err) {
      return cb(err);
    }
    User.create({
      username: userObj.username,
      password: hash
    }, function(err, user) {
      if(err){
        cb(err);
      } else {
        user.password = null;
        cb(err, user);
      }
    });
  });
};

User = mongoose.model('User', userSchema);

module.exports = User;
