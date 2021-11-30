var express = require('express');
var router = express.Router();


/* GET settings listing. */
router.get('/', async function(req, res, next) {

  res.json({ 
    themperatureSet: req.app.locals.themperatureSet
  });
});

router.post('/', async function(req, res, next) {

  console.log(req.body);

  req.app.locals.themperatureSet = req.body.themperatureSet

  res.setHeader('Content-Type', 'application/json');

  res.json({ 
    themperatureSet: req.app.locals.themperatureSet
  });
});

module.exports = router;
