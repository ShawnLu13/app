var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var customerRouter = require('./routes/customerRouter');
var manufacturerRouter = require('./routes/manufacturerRouter');
var salesRouter = require('./routes/salesRouter');
var logistian1Router = require('./routes/logistian1Router');
var logistian2Router = require('./routes/logistian2Router');
var logistian3Router = require('./routes/logistian3Router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 首页+表单路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/query', customerRouter); //revised
app.use('/register', manufacturerRouter); //revised
app.use('/sales_succ', salesRouter); //revised
app.use('/logistian1', logistian1Router); //ok
app.use('/logistian2', logistian2Router); //ok
app.use('/logistian3', logistian3Router); //ok

// 跳转路由
app.use('/role', indexRouter);
app.get('/customer', (req, res) => {
  res.render('customer');
});
app.get('/lo_1', (req, res) => {
  res.render('lo_1');
});
app.get('/lo_1_1', (req, res) => {
  res.render('lo_1_1');
});
app.get('/lo_1_2', (req, res) => {
  res.render('lo_1_2');
});
app.get('/lo_1_3', (req, res) => {
  res.render('lo_1_3');
});
app.get('/manufacture', (req, res) => {
  res.render('manufacture');
});
app.get('/customer', (req, res) => {
  res.render('customer');
});
app.get('/sales', (req, res) => {
  res.render('sales');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
