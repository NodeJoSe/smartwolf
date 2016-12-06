const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  ci: String,
  email: String,
  adress: {
    street: String,
    city: String,
    state: String
  }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);
