var express = require('express');
var router = express.Router();


/* GET settings listing. */
router.get('/', async function(req, res, next) {

  res.json({ 
    temperatureSet: req.app.locals.temperatureSet
  });
});


router.post('/', async function(req, res, next) {

  console.log(req.body);

  res.setHeader('Content-Type', 'application/json');

  req.app.locals.temperatureSet = req.body.temperatureSet;

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

  req.app.locals.rfEmitter.sendCode(code, {pin: 0})
    .then(function(stdout) {
      console.log('Code sent: ', stdout);
      res.send("ok");
    }, function(error) {
      console.log('Code was not sent, reason: ', error);
      res.send(error);
    });
	
});

module.exports = router;
