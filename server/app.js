global.__base = __dirname + "/";
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const uuid = require('node-uuid');
const config = require('./config');
const indexRoute = require("./routes");

let app = express();
let RedisStore = require('connect-redis')(session);

app.use(function(req, res, next) {
  req.id = uuid.v4();
  next();
});

app.use(session({
  key: 'gg-frontend.sid',
  store: new RedisStore({
    host: config.redis.host,
    port: config.redis.port,
  }),
  secret: '1a2b3c4d5e6f7g',
  resave: true,
  saveUninitialized: false
}));

// view engine setup
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
    watch: process.env.NODE_ENV !== "production"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  // res.render('error', locals);
  res.send(err.message);
});

module.exports = app;
