var express = require('express');
var router = express.Router();

var data = {
  name: 'Weibo',
  sex: 'Male',
  content: 'Parameters'
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', data);
});

module.exports = router;
