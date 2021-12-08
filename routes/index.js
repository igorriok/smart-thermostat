var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let temperatureSet = req.app.locals.temperatureSet;
  res.send({
    temperature: temperatureSet,
    heat: req.app.locals.heat
  });
});

module.exports = router;
