const mongoose= require('mongoose');
mongoose.connect('mongodb://68.183.109.170:27017/ubuddys',{useNewUrlParser:true , useCreateIndex:true,useUnifiedTopology: true,});

var conn =mongoose.Collection;

var courseSechema=new mongoose.Schema({
    coursetitle: String ,
    coursediscription: String ,
    courseintro: String ,
    courseprice: Number ,
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


var CoursesModel = mongoose.model('Courses', courseSechema);
var CourseCategories = mongoose.model('coursecategories', coursecatSechema);
module.exports= {CoursesModel,CourseCategories,conn};
