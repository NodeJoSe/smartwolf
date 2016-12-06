const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Factura = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  product: {
    type: Schema.ObjectId,
    ref: 'products'
  }
});

module.exports = mongoose.model('facturas', Factura);
