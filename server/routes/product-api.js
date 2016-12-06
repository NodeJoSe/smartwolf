'use strict';

const express = require('express');
const router = express.Router();

const Product = require('../models/product');


router.get('/getProduct/:id', getProduct);
router.delete('/getProduct/:id', deleteProduct);
router.post('/getProduct', saveProduct);
router.get('/getProduct/title/:title', productByTitle);

router.get('/getProducts', getProducts);
router.delete('/getProducts', deleteProducts);
router.get('/getProducts/os/:os', productsByOs);

function getProduct(req, res) {
  Product.findOne({
    _id: req.params.id
  }, function(err, data) {
    console.log(data);
    res.json(data);
  });
}

function deleteProduct(req, res) {
  Product.remove({
    _id: req.params.id
  }, function(err) {
    res.json({
      result: err ? 'error' : 'ok'
    });
  });
}

function saveProduct(req, res) {

  const product = new Product();

  product.title = req.body.title;
  product.brand = req.body.brand;
  product.price = req.body.price;
  product.URL = req.body.URL;
  product.os = req.body.os;

  product.save(function(err, data) {
    if (err)
      throw err;
    console.log(data);
    res.json(data);
  });

}

function productByTitle(req, res) {
  Product.findOne({
    title: req.params.title
  }, function(err, data) {
    if (err) {
      console.log('Error: ' + err);
    }
    console.log('productsByTitle' + data);
    res.json(data);
  });
}

function getProducts(req, res) {
  Product.find({}, function(err, data) {
    res.json(data);
  });
}

function deleteProducts(req, res) {
  Product.remove({}, function(err) {
    res.json({
      result: err ? 'error' : 'ok'
    });
  });
}

function productsByOs(req, res) {
  Product.find({
    os: req.params.os
  }, function(err, data) {
    if (err) {
      console.log('Error: ' + err);
    }
    console.log('ProductsByName' + data);
    res.json(data);
  });
}

module.exports = router;
