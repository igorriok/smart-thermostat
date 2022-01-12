var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
//const bodyParser = require('body-parser');
var rpi433 = require('rpi-433-v3');


var indexRouter = require('./routes/index');
var dataRouter = require('./routes/data');
var settingsRouter = require('./routes/settings');
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
app.locals.rfEmitter = rpi433.emitter({
	pin: 0,                     //Send through GPIO 0 (or Physical PIN 11)
	pulseLength: 350            //Send the code with a 350 pulse length
  });
app.locals.manualHeat = false;

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

	if (!app.locals.manualHeat) {
		
		const thermoData = await reportData();

		app.locals.temperature = thermoData.temperature;
		app.locals.humidity = thermoData.humidity;
		app.locals.pressure = thermoData.pressure;

		const deviation = 0.3;

		if (app.locals.temperatureSet - app.locals.temperature > deviation) {

			if (app.locals.heat !== true) {

				app.locals.heat = true;

				app.locals.rfEmitter.sendCode(1, {pin: 0})
					.then(function(stdout) {
						console.log('Code sent: ', stdout);
						res.send("ok");
					}, function(error) {
						console.log('Code was not sent, reason: ', error);
						res.send(error);
					});
			}

		} else {

			if (app.locals.heat !== false) {

				app.locals.heat = false;

				app.locals.rfEmitter.sendCode(0, {pin: 0})
					.then(function(stdout) {
						console.log('Code sent: ', stdout);
						res.send("ok");
					}, function(error) {
						console.log('Code was not sent, reason: ', error);
						res.send(error);
					});
			}
		}
	}

	return app.locals.heat;
}

setInterval(checkTemperature, 1000);

app.locals.checkTemperature = checkTemperature;

module.exports = app;
