'use strict';

const express = require('express');
const amazon = require('amazon-product-api');
const router = express.Router();
const client = amazon.createClient({
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
  awsTag: process.env.AWS_TAG
});

const Product = require('../models/product');

router.get('/amazon/search/:keywords', saveAmazonProducts);
router.get('/amazon/:search', getAmazonProducts);

function saveAmazonProducts(req, res) {

  console.log('amazon keyword = ' + req.params.keywords);

  client
    .itemSearch({
      browseNode: 2407749011,
      keywords: req.params.keywords,
      searchIndex: 'Wireless',
      condition: 'New',
      responseGroup: 'ItemAttributes,OfferSummary,Images',
    })
    .then(itemSearchSuccess)
    .catch(itemSearchError);

  function itemSearchSuccess(results) {
    let products = [];
    for (let i = 0; i < results.length; i++) {
      if (results[i].OfferSummary[0].TotalNew > 0 &&
        results[i].LargeImage !== undefined) {
        let product = new Product();
        product.title = results[i].ItemAttributes[0].Title;
        product.brand = results[i].ItemAttributes[0].Brand;
        product.price = results[i].OfferSummary[0].LowestNewPrice[0].Amount;
        product.URL = results[i].LargeImage[0].URL;
        product.os = results[i].ItemAttributes[0].OperatingSystem;
        console.log('producto #: ' + i + ' ' + results[i].ItemAttributes[0].OperatingSystem);
        product.save();
        products.push(product);
      }
    }
    console.log('ESTOS PRODUCTOS: ' + products);
    res.json(products);
  }

  function itemSearchError(err) {
    console.log(err);
  }

}

function getAmazonProducts(req, res) {

  console.log('busqueda = ' + req.params.search);

  client
    .itemSearch({
      browseNode: 2407749011,
      keywords: req.params.search,
      searchIndex: 'Wireless',
      condition: 'New',
      responseGroup: 'ItemAttributes,OfferSummary,Images',
    })
    .then(itemSearchSuccess)
    .catch(itemSearchError);

  function itemSearchSuccess(results) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].OfferSummary[0].TotalNew <= 0 ||
        results[i].LargeImage === undefined){
          results.splice(i, 1);
        }
    }
    res.json(results);
  }

  function itemSearchError(err) {
    console.log(err);
  }

}

module.exports = router;
