const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cart = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  product: {
    type: Schema.ObjectId,
    ref: 'products'
  }
});

module.exports = mongoose.model('carts', cart);
