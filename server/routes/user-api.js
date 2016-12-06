'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/getUser/:id', getUser);
router.get('/getUser', getCurrentUser);
router.post('/getUser/:id', saveUserAdress);
router.delete('/getUser/:id', deleteUser);

router.get('/getUsers', getUsers);
router.delete('/getUsers', deleteUsers);

function getUser(req, res) {
  User.findOne({
    _id: req.params.id
  }, function(err, data) {
    res.json(data);
  });
}

function getCurrentUser(req, res) {
  res.json(req.user);
}

function saveUserAdress(req, res) {
  User.findOne({
    _id: req.params.id
  }, function(err, data) {
    let user = data;
    user.ci = req.body.ci;
    user.email = req.body.email;
    user.adress.city = req.body.city;
    user.adress.state = req.body.state;
    user.adress.street = req.body.street;

    console.log('SET ADRESS: ' + req.body.email);
    user.save(function(err, data) {
      if (err){
        throw err;
      }
      res.json(data);
    });
  });
}

function deleteUser(req, res) {
  User.remove({
    _id: req.params.id
  }, function(err) {
    res.json({
      result: err ? 'error' : 'ok'
    });
  });
}

function getUsers(req, res) {
  User.find({}, function(err, data) {
    res.json(data);
  });
}

function deleteUsers(req, res) {
  User.remove({}, function(err) {
    res.json({
      result: err ? 'error' : 'ok'
    });
  });
}

module.exports = router;
