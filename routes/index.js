var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let themperatureSet = req.app.locals.themperatureSet;
  res.send({
    Themperature: themperatureSet,
    Heat: req.app.locals.heat
  });
});

module.exports = router;
