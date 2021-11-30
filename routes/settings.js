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

  req.app.locals.temperatureSet = req.body.temperatureSet

  res.setHeader('Content-Type', 'application/json');

  res.json({ 
    temperatureSet: req.app.locals.temperatureSet
  });
});

module.exports = router;
