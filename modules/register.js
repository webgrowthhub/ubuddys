const mongoose= require('mongoose');
mongoose.connect('mongodb://68.183.109.170:27017/ubuddys',{useNewUrlParser:true , useCreateIndex:true,useUnifiedTopology: true,});

var conn =mongoose.Collection;

var courseSechema=new mongoose.Schema({
    coursename: String,
    coursetitle: String,
    coursediscription: String,
    coursefdiscription: String,
    courseintro: String,
    courseprice: Number,
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
    tempassword: String,
    password: String,
    profile_status : { type: Number,      
        enum : [0,1],      
        default: 1  
        },
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


var CoursesModel = mongoose.model('Courses', courseSechema);
var CourseCategories = mongoose.model('coursecategories', coursecatSechema);
var Register = mongoose.model('regsiter',registerSechema);
var admin= mongoose.model("admins",AdminSechema);
var courseLecures=mongoose.model("courses_lectures",AdminCoursesSechema);
module.exports= {CoursesModel,CourseCategories,Register,admin,courseLecures,conn};
