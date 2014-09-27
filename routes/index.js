var express = require('express');
var router = express.Router();
var config = require('../config.json');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: config.appTitle });
});

module.exports = router;
