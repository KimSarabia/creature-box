var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users);
  });
});

router.get("/profile", User.authMiddleware, function(req, res) {
  res.send(req.user);
})

router.post('/authenticate', function(req, res) {
  User.authenticate(req.body, function(err, dbUser) {
    if(err) {
      res.status(400).send(err);
    } else {
      var token = dbUser.generateToken();
      res.cookie('usercookie', token).send(dbUser);
    }
  });
});



router.post('/register', function(req, res) {
  User.register(req.body, function(err, user) {
    if(err) {
      return res.status(400).send(err);
    } else {
      var token = user.generateToken();
      res.cookie("usercookie", token).send(user);
    }
  });
});


router.post("/logout", function(req, res) {
  res.clearCookie("usercookie").send();
})

module.exports = router;
