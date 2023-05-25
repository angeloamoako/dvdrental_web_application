var express = require('express');
var router = express.Router();
const db = require('../queries')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', db.getActors)


module.exports = router;
