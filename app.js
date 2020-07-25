var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var path = require('path');
var userModel=require("./modules/register");
const multer = require("multer");
const bodyParser= require('body-parser');
const fs = require('fs');
var session = require('client-sessions');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
//********************************Client Session In Whole website************************************* */
app.use(session({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  // duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  cookie: {
    ephemeral: true, // when true, cookie expires when the browser closes
    httpOnly: true, // when true, cookie is not accessible from javascript
    secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
  }
}));



var courseVideosestorage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    var check_path=  path.join(__dirname, "public/courses/coursesvideos");
      fs.exists(check_path, function(exists) {
        if(exists == false){
           const folderName = path.join(__dirname, "public/courses/coursesvideos");
        fs.mkdirSync(folderName);
        }
       
    });
    cb(null, 'public/courses/coursesvideos')
  },
 
})

var courseVideo = multer({ storage: courseVideosestorage });

/* GET home page. */
app.get('/', function(req, res, next) {
  var Allcourses=userModel.CoursesModel.find({course_status : 1}).limit(6);
  Allcourses.exec((err,data)=>{
    console.log(data);
     res.render('index',{Alldata : data});
  })
  
});

app.get('/aboutus',function(req, res, next) {
  res.render("aboutus");
});

app.get('/blog',function(req, res, next) {
  res.render("blog");
});

app.get('/contactus',function(req, res, next) {
  res.render("contactus");
});

app.get('/courses',function(req, res, next) {
  var get_res=userModel.CoursesModel.find({course_status : 1});
  get_res.exec((err,data)=>{
    res.render("courses",{CouresData: data});
  })
});

app.get('/lesson',function(req, res, next) {
  res.render("lesson");
});

app.get('/single-course',function(req, res, next) {
  var id=req.query.id;
  if(id){
    var get_res=userModel.CoursesModel.find({_id : id ,course_status : 1});
    get_res.exec((err,data)=>{
      res.render("single-course",{CouresData: data});
    })
  }
  
  
});

app.get('/admin',function(req, res, next) {
  res.render("admin/add-courses");
});

app.get('/course-details',function(req, res, next) {
  res.render("course-details");
});

app.get('/login',function(req, res, next) {
  res.render("login");
});

app.get('/signup',function(req, res, next) {
  res.render("sign-up");
});

app.get('/admin/add-courses',function(req, res, next) {
  res.render("admin/add-courses");
});

app.post('/admin/add-courses',courseVideo.single("courseintro"),(req, res) => {
  const tempPath = req.file.path;
  var getname=req.file.originalname.substr(0, req.file.originalname.indexOf('.'));
  const targetPath = path.join(__dirname, "public/courses/coursesvideos/"+req.file.originalname);
 
  var FileExtenstion=path.extname(req.file.originalname).toLowerCase();
  if (FileExtenstion === ".mp4" || FileExtenstion === ".3gp" || FileExtenstion
  === ".ogg" || FileExtenstion === ".webm" || FileExtenstion === ".webm" 
  || FileExtenstion === ".flv" || FileExtenstion === ".avi" || FileExtenstion === ".swf"
  || FileExtenstion === ".mkv" || FileExtenstion === ".vob" || FileExtenstion === ".ram"
  || FileExtenstion === ".mov" || FileExtenstion === ".mpeg" || FileExtenstion === ".mpg" || FileExtenstion === ".wmv" || FileExtenstion === ".rm" 
  || FileExtenstion === ".lxf") {
    fs.rename(tempPath, targetPath, err => {
      if (err) return handleError(err, res);

      fs.stat(targetPath, (error, stats) => { 
        if (error) { 
          console.log(error); 
        } 
        else { 
          var tittle=req.body.video_title;
          var NewImage=new userModel.CoursesModel({
            coursename: req.body.course_name,
            coursetitle: req.body.course_title,
            coursediscription: req.body.course_Description,
            coursefdiscription: req.body.course_fDescription,
            courseprice: req.body.coursePrice,
            courseintro: "courses/coursesvideos/"+req.file.originalname,
          });
          NewImage.save((err,doc)=>{
               
            
            res.render("admin/add-courses",{message: "Saved!"});
            
             
          });
        } 
      }); 
   
     
    });
  } else {
    fs.unlink(tempPath, err => {
      if (err) return handleError(err, res);

      res
        .status(403)
        .contentType("text/plain")
        .end("Only .png files are allowed!");
    });
  }


      // var Newcate=new userModel.CourseCategories({
      //   coursecat: course_cat ,
      // });
      // Newcate.save((err,saved)=>{
      //   if(saved){
      //     res.render("admin/add-course",{message: "Category Saved!"});
      //   }
      // })
  
});

app.get('/admin/add-courses',function(req, res, next) {
  res.render("admin/add-courses");
});





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});





// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
