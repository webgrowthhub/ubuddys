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
var generator = require('generate-password');
var Razorpay = require('razorpay');
var instance = new Razorpay({
  key_id: 'rzp_test_uipHkI2wkvuvpb',
  key_secret: 'XUjU4aqRV3f1ChLZ21l1QyfD',
})

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

var courseImageestorage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    var check_path=  path.join(__dirname, "public/courses/coursesimages");
      fs.exists(check_path, function(exists) {
        if(exists == false){
           const folderName = path.join(__dirname, "public/courses/coursesimages");
        fs.mkdirSync(folderName);
        }
       
    });
    cb(null, 'public/courses/coursesimages')
  },
 
})

var AdmincourseVideosestorage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    var check_path=  path.join(__dirname, "public/courses/admin/"+req.session.adminuser);
      fs.exists(check_path, function(exists) {
        if(exists == false){
           const folderName = path.join(__dirname, "public/courses/admin/"+req.session.adminuser);
        fs.mkdirSync(folderName);
        }
       
    });
    cb(null, 'public/courses/admin/'+req.session.adminuser)
  },
 
})

var courseVideo = multer({ storage: courseVideosestorage }).any('product_mainimage',1);;
var courseImage=multer({storage: courseImageestorage}).array('product_mainimage',1);;
var AdmincourseVideo = multer({ storage: AdmincourseVideosestorage });

//********************check Email while registeration*************************** */
function checkEmail(req,res,next){
  var useremail= req.body.reg_email.toLowerCase();
  var CheckUSername= userModel.Register.find({ email : useremail}
       );
  CheckUSername.exec((err,data)=>{
    if(data[0]){
      return res.render("sign-up" , { message : "Email Already Exist"});
    }else{
      next();
    }
    
  })
}

  /****************check User Session **********/

  function checkAdminSession(req,res,next){
    var userSession= req.session.adminuser;
    if(userSession == undefined){
      return res.redirect('/admin/login');
    }else{
      next();
    }
  }

/* GET home page. */
app.get('/', function(req, res, next) {
  var Allcourses=userModel.CoursesModel.find({course_status : 1}).limit(6).sort( { _id : -1} );
  Allcourses.exec((err,data)=>{
    if(req.session.user){
      var getuser=userModel.Register.find({email: req.session.user ,enrollcourses:{$nin:[null,""]} });
      getuser.exec((err,coursedata)=>{
       if(coursedata[0]){
        // var enrolledcourses=userModel.CoursesModel.find({_id: {$in: coursedata[0].enrollcourses}});
        // enrolledcourses.exec((en_error,Enroldata)=>{
         
        // })
        res.render('index',{Alldata : data,usersession: req.session.user,EnrollCourse : coursedata});
       }else{
        res.render('index',{Alldata : data,usersession: req.session.user});
       }
       
      })
    }else{
      res.render('index',{Alldata : data,usersession: req.session.user});
    }
    
  })
  
});

app.get('/aboutus',function(req, res, next) {
  if(req.session.user){
    var getuser=userModel.Register.find({email: req.session.user ,enrollcourses:{$nin:[null,""]} });
    getuser.exec((err,coursedata)=>{
     if(coursedata[0]){
      res.render("aboutus",{usersession: req.session.user,EnrollCourse : coursedata});
     }else{
      res.render("aboutus",{usersession: req.session.user});
     }
     
    })
  }else{
    res.render("aboutus",{usersession: req.session.user});
  }
 
});

app.get('/blog',function(req, res, next) {
  res.render("blog");
});



app.get('/payment',function(req, res, next) {
  var amount= 2000,
  currency='INR',
  receipt = '1234545f4',
  payment_capture =true,
  notes ="something",
  order_id,payment_id;

  instance.orders.create({amount, currency, receipt, payment_capture, notes}).then((response) => {
    console.log("**********Order Created***********");
    console.log(response);
    console.log("**********Order Created***********");
order_id=response.id;

}).catch((error) => {
  console.log(error);
})
// instance.payments.capture(order_id, amount).then((response) => {
//     console.log(response);
// }).catch((error) => {
//   console.log(error);
// });
res.render('payment_checkout',{order_id:order_id,amount:amount});
});



/*****************
 * Payment status*
 *****************/
app.post('/purchase', (req,res) =>{
  req.session.C_course_name=req.body.course_name;
  payment_id =  req.body;
  console.log("**********Payment authorized***********");
  console.log(payment_id);
  console.log("**********Payment authorized***********");
  instance.payments.fetch(payment_id.razorpay_payment_id).then((response) => {
  console.log("**********Payment instance***********");
  console.log(response); 
  console.log("**********Payment instance***********")
  instance.payments.capture(payment_id.razorpay_payment_id, response.amount).then((response) => {
  var NewPay=new userModel.Payments({
      paymentId: response.id,
      email: req.session.user,
      amount: response.amount,
      course_id:  req.session.purchase_course,
      course_name: req.session.C_course_name
    });
    NewPay.save((err,saved)=>{
      if(saved){
        var update_q=userModel.Register.find({email: req.session.user});
        update_q.exec((erorr,GetData)=>{
          if(GetData[0]){
            if(GetData[0].enrollcourses){
              var courseArray=GetData[0].enrollcourses;
              courseArray.push( req.session.purchase_course);
              var update=userModel.Register.updateOne({email: req.session.user},{enrollcourses: courseArray});
              update.exec((eorrr,upd)=>{
                if(upd){
                  res.redirect('/thankyou');
                }
              });
            }else{
              var courseArray=[];
              courseArray.push( req.session.purchase_course);
              var update=userModel.Register.updateOne({email: req.session.user},{enrollcourses: courseArray});
              update.exec((errrrr,iUpdate)=>{
                if(iUpdate){
                  res.redirect('/thankyou');
                }
              });
            }
          }
        })
        
      }
    })
    
 
}).catch((error) => {
console.log(error);
});


}).catch((error) => {
console.log(error);
});

})


app.get('/admin/login',function(req, res, next) {
  if(req.session.adminuser){
    res.redirect("/admin");
  }else{
    res.render("admin/login");
  }

});

app.get('/thankyou',function(req, res, next) {

    res.render("thankyou",{usersession: req.session.user});
 
});
app.get('/admin/allusers',function(req, res, next) {
  var allu=userModel.Register.find({});
  allu.exec((err,data)=>{
    if(data){
       res.render("admin/allusers",{Alldata: data});
    }
  })
    
  

});

app.post('/admin/change_status',function(req, res, next) {

console.log(req.body);
var update_req=userModel.Register.updateOne({email : req.body.email},{profile_status : req.body.status});
update_req.exec((err,saved)=>{
  if(saved){
    res.send("1");
  }
})

})

app.post('/admin/change_coursestatus',function(req, res, next) {

  console.log(req.body);
  var update_req=userModel.CoursesModel.updateOne({_id : req.body.id},{course_status : req.body.status});
  update_req.exec((err,saved)=>{
    if(saved){
      res.send("1");
    }
  })
  
  })

app.get('/admin/all_courses',function(req, res, next) {

  
  var get_all=userModel.CoursesModel.find({ course_status : 1});
  get_all.exec((err,Allrecord)=>{
      return res.render("admin/all_courses",{Alldata: Allrecord });
  })
  
  })


  app.post('/admin/all_courses',function(req, res, next) {
      var search_course=req.body.search_course;
  
    var get_all=userModel.CoursesModel.find({ coursename : search_course});
    get_all.exec((err,Allrecord)=>{
        return res.render("admin/all_courses",{Alldata: Allrecord });
    })
    
    })

app.post('/admin/login',function(req, res, next) {
  var email =req.body.email.toLowerCase();
  var pass = req.body.password;

  var get_res= userModel.admin.find({ email : email , password : pass});
  get_res.exec((err,data)=>{
    console.log(data);
    req.session.adminuser = email;
    if(data[0]){
      return  res.redirect("/admin/add-courses");
    }else{
      return  res.render('admin/login', { message : 'Username/Password is not exist' }); 
    }
   
  })
 
});

app.get('/contactus',function(req, res, next) {
  if(req.session.user){
    var getuser=userModel.Register.find({email: req.session.user ,enrollcourses:{$nin:[null,""]} });
    getuser.exec((err,coursedata)=>{
     if(coursedata[0]){
      res.render("contactus",{usersession: req.session.user,EnrollCourse : coursedata});
     }else{
      res.render("contactus",{usersession: req.session.user});
     }
     
    })
  }else{
    res.render("contactus",{usersession: req.session.user});
  }

});

app.post('/mycourses',function(req, res, next) {

var s=req.body.s;
var getuser=userModel.Register.find({email: req.session.user ,enrollcourses:{$nin:[null,""]} });
      getuser.exec((err,coursedata)=>{
var searchcourses=userModel.CoursesModel.find({_id: {$in: coursedata[0].enrollcourses},'coursetitle': {'$regex': s} });
searchcourses.exec((err,data)=>{
  console.log(data);
  if(data[0]){
    res.render("mycourses",{usersession: req.session.user,EnrollCourse : coursedata ,enrolledCourses: data});
  }else{
    res.render("mycourses",{usersession: req.session.user,EnrollCourse : undefined ,enrolledCourses: undefined});
  }
 
})

      })


})

app.get('/mycourses',function(req, res, next) {
  
    
      var getuser=userModel.Register.find({email: req.session.user ,enrollcourses:{$nin:[null,""]} });
      getuser.exec((err,coursedata)=>{
       if(coursedata[0]){
        var enrolledcourses=userModel.CoursesModel.find({_id: {$in: coursedata[0].enrollcourses}});
        enrolledcourses.exec((en_error,Enroldata)=>{
          res.render("mycourses",{usersession: req.session.user,EnrollCourse : coursedata ,enrolledCourses: Enroldata});
         })
        
       }else{
        res.render("mycourses",{usersession: req.session.user,EnrollCourse : undefined ,enrolledCourses: undefined});
       }
       
      })
    
   




});

app.post('/courses',function(req, res, next) {
  var pageNo = parseInt(req.query.row);
  
    var skipp=0;
  
var s=req.body.s;
var get_res=userModel.CoursesModel.find({course_status : 1 , 'coursetitle': {'$regex': s} });
get_res.exec((err,getdata)=>{
  console.log(getdata);
  if(getdata[0]){
    res.render("courses",{CouresData: getdata,usersession: req.session.user, Totalcourses: undefined,currentPage: skipp});
  }else{
    res.render("courses",{CouresData: getdata,usersession: req.session.user, Totalcourses: undefined,currentPage: skipp});
  }
})



})





app.get('/courses',function(req, res, next) {
  var pageNo = parseInt(req.query.row);
 if(!pageNo){
   var skipp=0;
 }else{
  var skipp=pageNo;
 }
  var get_res=userModel.CoursesModel.find({course_status : 1}).skip(skipp).limit(10);
  get_res.exec((err,data)=>{
    if(req.session.user){
      var getuser=userModel.Register.find({email: req.session.user ,enrollcourses:{$nin:[null,""]} });
      getuser.exec((err,coursedata)=>{
        var enrolledcourses=userModel.CoursesModel.find({course_status : 1}).countDocuments();
        enrolledcourses.exec((en_error,Enroldata)=>{
       if(coursedata[0]){
       
          res.render("courses",{CouresData: data,usersession: req.session.user,EnrollCourse : coursedata, Totalcourses: Enroldata ,currentPage: skipp});
      
      
       }else{
        res.render("courses",{CouresData: data,usersession: req.session.user, Totalcourses: Enroldata,currentPage: skipp});
       }
      })
       
      })
    }else{
      var enrolledcourses=userModel.CoursesModel.find({course_status : 1}).countDocuments();
      enrolledcourses.exec((en_error,Enroldata)=>{
      res.render("courses",{CouresData: data,usersession: req.session.user,Totalcourses: Enroldata,currentPage: skipp});
      })
    }
   


    
  })
});

app.post('/getlession_description',function(req, res, next) {
  var get_res=userModel.courseLecures.find({_id : req.body.id ,lecture_status : 1}).sort({"_id": 1});
  get_res.exec((err,data)=>{
    res.send(data[0].lecture_description);
  })

})

app.get('/lesson',function(req, res, next) {
  var course_id=req.query.id;
  var get_res=userModel.courseLecures.find({course_id : course_id ,lecture_status : 1}).sort({"_id": 1});
    get_res.exec((err,data)=>{
     var get_res22=userModel.CoursesModel.find({_id : course_id ,course_status : 1});
      get_res22.exec((err22,data2)=>{
        console.log(data2);
        res.render("lesson",{CouresData: data,usersession: req.session.user,coursetitle: data2, totlalec: data.length });
      })
    
     
    })
  
});



app.get('/admin/payments',function(req, res, next) {
  var allPayments=userModel.Payments.find({});
  allPayments.exec((err,data)=>{
    if(data){
      return res.render("admin/payments",{Alldata : data});
    }
  })


})

app.post('/admin/payments',function(req, res, next) {
  if(req.body.search_email != ''){
    var allPayments=userModel.Payments.find({ email: req.body.search_email.toLowerCase()});
  allPayments.exec((err,data)=>{
    if(data[0]){
      return res.render("admin/payments",{Alldata : data});
    }else{
      return res.render("admin/payments",{Alldata : ''});
    }
  })
  }else{
    var allPayments=userModel.Payments.find({});
    allPayments.exec((err,data)=>{
      if(data){
        return res.render("admin/payments",{Alldata : data});
      }
    })
  }

})


app.get('/single-course',function(req, res, next) {
  var id=req.query.id;
  if(id){
    var get_res=userModel.CoursesModel.find({_id : id ,course_status : 1});
    get_res.exec((err,data)=>{
      var enrolledcourses=userModel.Register.find({enrollcourses: {$in: [id]}});
      enrolledcourses.exec((en_error,Enroldata)=>{
if(Enroldata[0]){
  console.log(Enroldata);

  res.render("single-course",{CouresData: data,usersession: req.session.user,Current_status: 1});
}else{
  req.session.purchase_course=req.query.id;
  var amount= data[0].courseprice,
  currency='INR',
  receipt = '1234545f4',
  payment_capture =true,
  notes ="Payment",
  order_id,payment_id;

  instance.orders.create({amount, currency, receipt, payment_capture, notes}).then((response) => {
    console.log("**********Order Created***********");
    console.log(response);
    console.log("**********Order Created***********");
order_id=response.id;

}).catch((error) => {
  console.log(error);
})
// instance.payments.capture(order_id, amount).then((response) => {
//     console.log(response);
// }).catch((error) => {
//   console.log(error);
// });

  res.render("single-course",{CouresData: data,usersession: req.session.user,Current_status: 0,order_id:order_id,amount:amount});
}


      })
   
    })
  }
  
  
});


app.post('/single-course',function(req, res, next) {
  req.session.purchase_course=req.body.purchase_course;
 var getcourse_data=userModel.CoursesModel.find({_id : req.body.purchase_course ,course_status : 1});
 getcourse_data.exec((err,data)=>{

  var amount= data[0].courseprice,
  currency='INR',
  receipt = '1234545f4',
  payment_capture =true,
  notes ="Payment",
  order_id,payment_id;

  instance.orders.create({amount, currency, receipt, payment_capture, notes}).then((response) => {
    console.log("**********Order Created***********");
    console.log(response);
    console.log("**********Order Created***********");
order_id=response.id;

}).catch((error) => {
  console.log(error);
})
// instance.payments.capture(order_id, amount).then((response) => {
//     console.log(response);
// }).catch((error) => {
//   console.log(error);
// });
 return res.render('payment_checkout',{order_id:order_id,amount:amount});
 })
  
});

app.get('/admin',checkAdminSession,function(req, res, next) {
  res.render("admin/add-courses");
});

app.get('/admin/add-lectures',checkAdminSession,function(req, res, next) {
  var get_lec=userModel.CoursesModel.find({ addedby: req.session.adminuser ,course_status : 1});
  get_lec.exec((err,data)=>{
    if(data){
      res.render("admin/add-lectures",{Alldata: data});
    }
  })
  
});

  app.post('/admin/add-lectures',AdmincourseVideo.single("courseintro"),(req, res) => {
    const tempPath = req.file.path;
    var FileExtenstion=path.extname(req.file.originalname).toLowerCase();
  var getname=req.file.originalname.substr(0, req.file.originalname.indexOf('.'));
  const targetPath = path.join(__dirname, "public/courses/admin/"+req.session.adminuser+'/'+req.file.originalname);
  const checktargetPath = path.join(__dirname, "public/courses/admin/"+req.session.adminuser+'/'+getname+FileExtenstion);

 
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

          var get_no=userModel.courseLecures.find({addedby: req.session.adminuser }).sort( { lecture_no : -1} );
          get_no.exec((eorr,New_no)=>{
            if(New_no[0]){
              var lec_n=New_no[0].lecture_no+1;
            }else{
              var lec_n=1;
            }
            console.log(lec_n);
            var NewImage=new userModel.courseLecures({
              addedby: req.session.adminuser,
              course_id: req.body.select_courses,
              lecture_video: "courses/admin/"+req.session.adminuser+'/'+req.file.originalname,
              lecture_title : req.body.course_fDescription,
              lecture_description: req.body.course_fullDescription,
              lecture_no: lec_n,
            });
            NewImage.save((err,doc)=>{
                 
                      res.send("true");
                   
               
            });
          })
       
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
  
});


app.get('/logout', (req,res)=>{
  req.session.reset();
   return res.redirect('login');
});

app.get('/cart', (req,res)=>{
 return res.render("cart");
});

app.get('/admin/logout', (req,res)=>{
  req.session.reset();
   return res.redirect('/admin/login');
});

app.get('/course-details',function(req, res, next) {
  res.render("course-details");
});

app.get('/login',function(req, res, next) {
  res.render("login",{usersession : ''});
});

app.get('/admin/add-courses-image',function(req, res, next) {
  var getCVourse=userModel.CoursesModel.find({});
  getCVourse.exec((err,datat)=>{
    res.render("admin/add-course-image",{AllRecords : datat});
  })
  
});
app.post("/admin/add-courses-image",(req, res) => {
  
  const tempPath = req.file.path;
      
  const targetPath = path.join(__dirname, "public/courses/coursesimages"+req.file.originalname);

  if (path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".jpg" || path.extname(req.file.originalname).toLowerCase()
  === ".jpeg" || path.extname(req.file.originalname).toLowerCase() === ".tiff" || path.extname(req.file.originalname).toLowerCase() === ".gif") {
    fs.rename(tempPath, targetPath, err => {
      if (err) return handleError(err, res);
      var NewImage=new userModel.Courses_images({
        course_id: req.body.course_id,
        image: "courses/coursesimages"+req.file.originalname
      });
      NewImage.save((err,save)=>{
        if(save){
          var getCVourse=userModel.CoursesModel.find({});
          getCVourse.exec((err,datat)=>{
            res.render("admin/add-course-image",{AllRecords : datat, message : "Image Saved!"});
          })
        
        }
      })
     
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
 
});

app.post('/login',function(req, res, next) {
  var email = req.body.useremail.toLowerCase();
  var pass=req.body.password;
  var get_res=userModel.Register.find({ email : email , password : pass ,profile_status : 1});
  get_res.exec((err,data)=>{
    req.session.user = email;
    if(data[0]){
      return res.redirect('courses');
    }else{
      return  res.render('login', { message : 'Username/Password is not exist',usersession : '' }); 
    }
   
  })
 
});

app.get('/signup',function(req, res, next) {
  res.render("sign-up",{usersession : '' });
});

app.post('/signup',checkEmail,function(req, res, next) {
  //       //   var Password = generator.generate({
//       //     length: 10,
//       //     numbers: true
//       // });
  var NewUser=new userModel.Register({
    firstname: req.body.reg_firstname,
    lastname: req.body.reg_lastname,
    email: req.body.reg_email.toLowerCase(),
    password: req.body.reg_password,
  });
  NewUser.save((err,saved)=>{
    if(saved){
      res.render("sign-up",{message : "Registration Successfully! Please Login Now !"});
    }
  });
});

app.get('/admin/add-courses',checkAdminSession,function(req, res, next) {
  res.render("admin/add-courses");
});

app.post('/admin/add-courses',(req, res) => {
  
  courseVideo(req,res,function(error){
    console.log(req.files);
    if(req.files[0].fieldname == 'courseintro'){
     
     
  const tempPath = req.files[0].path; 
  const targetPath = path.join(__dirname, "public/courses/coursesvideos/"+req.files[0].originalname);
 
  var FileExtenstion=path.extname(req.files[0].originalname).toLowerCase();
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
            addedby: req.session.adminuser,
            courseintro: "courses/coursesvideos/"+req.files[0].originalname,
            courseImage: "courses/coursesimages/"+req.files[1].originalname,
          });
          NewImage.save((err,doc)=>{
               
            const tempPath2 = req.files[1].path; 
            const targetPath2 = path.join(__dirname, "public/courses/coursesimages/"+req.files[1].originalname);
             
                if (path.extname(req.files[1].originalname).toLowerCase() === ".png" || path.extname(req.files[1].originalname).toLowerCase() === ".jpg" || path.extname(req.files[1].originalname).toLowerCase()
                === ".jpeg" || path.extname(req.files[1].originalname).toLowerCase() === ".tiff" || path.extname(req.files[1].originalname).toLowerCase() === ".gif") {
                  fs.rename(tempPath2, targetPath2, err2 => {
                    if (err2) return handleError(err2, res);

                    
                    res.render("admin/add-courses",{message: "Saved!"});



                  })
                }
           
            
             
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


    }



})
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
