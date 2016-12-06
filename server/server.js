const path = require('path');
const http = require('http');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const debug = require('debug')('passport-mongo');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const logger = require('morgan');

const User = require('./models/user');

// create instance of express
const app = express();
const port = process.env.PORT || 8080;

// mongodb config
const db = mongoose.connection;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const ds = process.env.DS;
const d0 = process.env.DS_0;

mongoose.connect(`mongodb://${dbUser}:${dbPass}${d0}.mlab.com:${ds}/${dbName}`);

db
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', function() {
    console.log('Database connected!');
  });

// define middlewares
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(cookieParser());
// express Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true
}));
// configure passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// static files
app.use(favicon(path.join(__dirname, '../client/public/img/favicon.ico')));
app.use('/libs', express.static(path.join(__dirname, '../node_modules')));
app.use(express.static(path.join(__dirname, '../client')));

// api restful routes
app.use('/user/', require('./routes/user-api'));
app.use('/user/', require('./routes/auth-api'));
app.use('/product/', require('./routes/product-api'));
app.use('/factura/', require('./routes/factura-api'));
app.use('/cart/', require('./routes/cart-api'));
app.use('/api/', require('./routes/amazon-api'));

app.get('/*', html5Mode);

function html5Mode(req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'));
}

// error handlers
app.use(notFound);
app.use(errorStatus);

function notFound(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
}

function errorStatus(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
}


const server = http
  .createServer(app)
  .listen(port, function() {
    debug('Express server listening on port ' + server.address().port);
    console.log('Server running on port: ' + server.address().port);
  });
