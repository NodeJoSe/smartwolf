'use strict';

const express = require('express');
const Cart = require('../models/cart');
const router = express.Router();

router.get('/getCart', getCart);
router.delete('/getCart', deleteCart);

router.post('/getCartItem', saveCartItem);
router.delete('/getCartItem/:id', deleteCartItem);

function getCart(req, res) {
  Cart
    .find({
      user: req.user.id
    })
    .populate('user product')
    .exec(function(err, products) {
      console.log(products);
      res.json(products);
    });
}

function deleteCart(req, res) {
  Cart.remove({
    user: req.user.id
  }, function(err) {
    res.json({
      result: err ? 'error' : 'ok'
    });
  });
}

function saveCartItem(req, res) {
  const cart = new Cart();

  console.log('EL ID USER' + req.user.id);
  cart.user = req.user.id;
  console.log('EL ID product' + req.body._id);
  cart.product = req.body._id;

  cart.save(function(err, data) {
    if (err)
      throw err;
    res.json(data);
  });

}

function deleteCartItem(req, res) {
  Cart.remove({
    product: req.params.id,
    user: req.user.id
  }, function(err) {
    res.json({
      result: err ? 'error' : 'ok'
    });
  });
}

module.exports = router;
