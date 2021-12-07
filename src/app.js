var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
//const bodyParser = require('body-parser');

var indexRouter = require('../routes/index');
var dataRouter = require('../routes/data');
var settingsRouter = require('../routes/settings');

var app = express();

// app.set('view engine', 'html');
//app.use(bodyParser.json());

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.locals.themperatureSet = 24;
app.locals.heat = false;

app.use('/', indexRouter);
app.use('/data', dataRouter);
app.use('/settings', settingsRouter);

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
  res.json(err);
});

function checkTemperature(themperature, themperatureSet) {
  
	console.log("checking temperature: " + themperature 
	+ " Themperature set: " + themperatureSet 
	+ " Heat: " + app.locals.heat);

  	const deviation = 0.3;

	if (themperatureSet - themperature > deviation) {
		app.locals.heat = true;
	} else {
		app.locals.heat = false;
	}

}

setInterval(checkTemperature, 1000, 23, app.locals.themperatureSet);

module.exports = app;
