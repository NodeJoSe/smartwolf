'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

const User = require('../models/user');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/status', userStatus);

function register(req, res) {
  console.log(req.body);
  User.register(new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }), req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    console.log('acount: ' + account);
    res.json(account);
  });
}

function login(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
}

function logout(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
}

function userStatus(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: req.user.username
  });
}

module.exports = router;
