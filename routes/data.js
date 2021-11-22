var express = require('express');
var router = express.Router();
const reportData = require('../src/thermo');

/* GET data listing. */
router.get('/', async function(req, res, next) {

  const thermoData = await reportData();

  res.send({ 
    temperature: thermoData.temperature, 
    pressure: thermoData.pressure, 
    humidity: thermoData.humidity
  });
});

module.exports = router;
