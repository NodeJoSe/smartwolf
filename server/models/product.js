const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
  title: String,
  brand: String,
  price: String,
  URL: String,
  os: String,
});

module.exports = mongoose.model('products', Product);
