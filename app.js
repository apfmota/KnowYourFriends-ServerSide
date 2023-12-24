var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var amigosRouter = require('./routes/amigos');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var criarGaleraRouter = require('./routes/criarGalera')
var amigosGaleraRouter = require('./routes/amigosGalera')
var iconesRouter = require('./routes/icones')
var galerasRouter = require('./routes/galeras');
var partidaRouter = require('./routes/partida');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/novo-amigo', amigosRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/nova-galera', criarGaleraRouter);
app.use('/amigos-galera', amigosGaleraRouter);
app.use('/icone-amigo', iconesRouter);
app.use('/galeras', galerasRouter);
app.use('/partida', partidaRouter);

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
