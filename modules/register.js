const mongoose= require('mongoose');
mongoose.connect('mongodb://rahul:sahil420admin@68.183.109.170:27017/ubuddys',{useNewUrlParser:true , useCreateIndex:true,useUnifiedTopology: true,});

var conn =mongoose.Collection;

var courseSechema=new mongoose.Schema({
    coursename: String,
    coursetitle: String,
    coursediscription: String,
    coursefdiscription: String,
    courseintro: String,
    courseprice: Number,
    courseImage: String,
    addedby: String,
    course_status : { type: Number,      
        enum : [0,1],      
        default: 1  
        },
})

var coursecatSechema=new mongoose.Schema({
    coursecat: String ,
    status : { type: Number,      
        enum : [0,1],      
        default: 1  
        },
})

var registerSechema=new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    mobile : Number,
    enrollcourses : Array,
    profile_status : { type: Number,      
        enum : [0,1],      
        default: 1  
        },
        Registerdate: { type: Date, default: Date.now },
})

var AdminSechema=new mongoose.Schema({
    email: String,
    password: String,
    profile_status : { type: Number,      
        enum : [0,1],      
        default: 1  
        },
})

var AdminCoursesSechema=new mongoose.Schema({
    
    addedby: String,
    course_id: String,
    lecture_video: String,
    lecture_description: String,
    lecture_status : { type: Number,      
        enum : [0,1],      
        default: 1  
        },
})

var AdminCoursesSechema=new mongoose.Schema({
    lecture_no: Number,
    addedby: String,
    course_id: String,
    lecture_video: String,
    lecture_title: String,
    lecture_description: String,
    lecture_status : { type: Number,      
        enum : [0,1],      
        default: 1  
        },
 addeddate: { type: Date, default: Date.now },
})

var PaymentsSechme=new mongoose.Schema({
    paymentId: String,
    email: String,
    amount: String,
    course_id: String,
    course_name: String,
    paymentdate: { type: Date, default: Date.now },
 
})

var CourseImageSechme=new mongoose.Schema({
    course_id: String,
  image: String
})


var CoursesModel = mongoose.model('Courses', courseSechema);
var CourseCategories = mongoose.model('coursecategories', coursecatSechema);
var Register = mongoose.model('regsiter',registerSechema);
var admin= mongoose.model("admins",AdminSechema);
var courseLecures=mongoose.model("courses_lectures",AdminCoursesSechema);
var Payments=mongoose.model("payments",PaymentsSechme);
var Courses_images=mongoose.model("courseImages",CourseImageSechme);
module.exports= {CoursesModel,CourseCategories,Register,admin,courseLecures,conn,Payments,Courses_images};
