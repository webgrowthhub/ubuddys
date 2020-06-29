var express = require('express');
var router = express.Router();
/**************Mongoose Data Models **********/
var userModel=require("../modules/register");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/aboutus',function(req, res, next) {
  res.render("aboutus");
});

router.get('/blog',function(req, res, next) {
  res.render("blog");
});

router.get('/contactus',function(req, res, next) {
  res.render("contactus");
});

router.get('/courses',function(req, res, next) {
  res.render("courses");
});

router.get('/lesson',function(req, res, next) {
  res.render("lesson");
});

router.get('/single-course',function(req, res, next) {
  res.render("single-course");
});


module.exports = router;
