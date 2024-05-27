//Liujiacheng 2022110204
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('logistics', { title: 'logistics' });
});

module.exports = router;
