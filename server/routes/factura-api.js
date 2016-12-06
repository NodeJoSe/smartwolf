'use strict';

const express = require('express');
const router = express.Router();

const Factura = require('../models/factura');
const Cart = require('../models/cart');


router.get('/getFactura/:id', getFactura);
router.get('/getFacturaId/:id', getFacturaId);
router.delete('/getFactura/:id', deleteFactura);
router.post('/getFactura', saveFactura);

router.get('/getFacturas', getFacturas);
router.delete('/getFacturas', deleteFacturas);

router.get('/user/getFacturas', getUserfacturas);
router.post('/cart/facturas', saveCartFacturas);

function getFacturaId(req, res) {
  Factura
    .findOne({
      _id: req.params.id
    })
    .populate('user product')
    .exec(function(err, factura) {
      console.log(factura);
      res.json(factura);
    });
}

function getFactura(req, res) {
  Factura
    .findOne({
      _id: req.params.id
    }, function(err, data) {
      console.log(data);
      res.json(data);
    });
}

function deleteFactura(req, res) {
  Factura.remove({
    _id: req.params.id
  }, function(err) {
    res.json({
      result: err ? 'error' : 'ok'
    });
  });
}

function saveFactura(req, res) {

  const factura = new Factura();

  console.log('EL ID USER' + req.user.id);
  factura.user = req.user.id;
  console.log('EL ID product' + req.body._id);
  factura.product = req.body._id;

  factura.save(function(err, data) {
    if (err){
      throw err;
    }
    res.json(data);
  });

}



function getFacturas(req, res) {
  Factura
    .find({})
    .populate('user product')
    .exec(function(err, facturas) {
      console.log(facturas);
      res.json(facturas);
    });
}

function deleteFacturas(req, res) {
  Factura.remove({}, function(err) {
    res.json({
      result: err ? 'error' : 'ok'
    });
  });
}

function getUserfacturas(req, res) {
  Factura
    .find({
      user: req.user.id
    })
    .populate('user product')
    .exec(function(err, facturas) {
      console.log(facturas);
      res.json(facturas);
    });
}

function saveCartFacturas(req, res) {
  const facturas = [];
  for (let i = 0; i < req.body.length; i++) {
    let factura = new Factura();

    console.log('EL ID USER' + req.user.id);
    factura.user = req.user.id;
    console.log('EL ID product' + req.body[i].product._id);
    factura.product = req.body[i].product._id;

    factura.save();
    facturas.push(factura);
  }

  Cart.remove({
    user: req.user.id
  }, function(err) {
    res.json({
      result: err ? 'error' : 'ok'
    });
  });

}

module.exports = router;
