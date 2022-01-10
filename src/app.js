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
const reportData = require('../src/thermo');

var app = express();

// app.set('view engine', 'html');
//app.use(bodyParser.json());

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.locals.temperatureSet = 24;
app.locals.heat = false;
app.locals.temperature = 0;
app.locals.humidity = 0;
app.locals.pressure = 0;

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

async function checkTemperature() {
  
	/* console.log("checking temperature: " + app.locals.temperature 
	+ " Temperature set: " + app.locals.temperatureSet 
	+ " Heat: " + app.locals.heat);
	*/

	const thermoData = await reportData();

	app.locals.temperature = thermoData.temperature;
	app.locals.humidity = thermoData.humidity;
	app.locals.pressure = thermoData.pressure;

  	const deviation = 0.3;

	if (app.locals.temperatureSet - app.locals.temperature > deviation) {
		app.locals.heat = true;
	} else {
		app.locals.heat = false;
	}

}

setInterval(checkTemperature, 1000);

module.exports = app;
