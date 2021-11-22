var express = require('express');
var router = express.Router();

let tempSet = 24;

/* GET settings listing. */
router.get('/', async function(req, res, next) {

  res.json({ 
    tempSet: tempSet
  });
});

router.post('/', async function(req, res, next) {

  console.log(req.body);

  tempSet = req.body.tempSet

  res.setHeader('Content-Type', 'application/json');

  res.json({ 
    tempSet: tempSet
  });
});

module.exports = router;
