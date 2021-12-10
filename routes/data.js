var express = require('express');
var router = express.Router();
// const reportData = require('../src/thermo');

/* GET data listing. */
router.get('/', async function(req, res, next) {

  res.send({ 
    temperature: req.app.locals.temperature, 
    pressure: req.app.locals.pressure, 
    humidity: req.app.locals.humidity
  });
});

module.exports = router;
