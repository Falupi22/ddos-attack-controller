var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/ping');
const { connectRabbitMQ, consumeMessagesAndBroadcast } = require('./amqp');

var app = express();
let io = {
  socketIo: null
}

// Connect to RabbitMQ
connectRabbitMQ().then(value => {
  consumeMessagesAndBroadcast((message) => {
    io.socketIo.emit('new_message', message);
  });
}).catch(console.error);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())

app.use('/', indexRouter);
app.use('/ping', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json();
});

module.exports = { app, io };
