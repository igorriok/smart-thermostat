var express = require('express');
var router = express.Router();
var rpi433 = require('rpi-433-v3');

rfEmitter = rpi433.emitter({
  pin: 0,                     //Send through GPIO 0 (or Physical PIN 11)
  pulseLength: 350            //Send the code with a 350 pulse length
});


/* GET settings listing. */
router.get('/', async function(req, res, next) {

  res.json({ 
    temperatureSet: req.app.locals.temperatureSet
  });
});

router.post('/', async function(req, res, next) {

  console.log(req.body);

  res.setHeader('Content-Type', 'application/json');

  res.json({ 
    temperatureSet: req.app.locals.temperatureSet
  });
});

router.post('/heat/', async function(req, res, next) {

  console.log(req.body);

  let code = 0;
  if (req.body.state === "on") {
    code = 1;
  } else if (req.body.state === "off") {
    code = 0;
  }

  rfEmitter.sendCode(code, {pin: 0})
    .then(function(stdout) {
      console.log('Code sent: ', stdout);
      res.send("ok");
    }, function(error) {
      console.log('Code was not sent, reason: ', error);
      res.send(error);
    });

  res.send("ok");
});

module.exports = router;
