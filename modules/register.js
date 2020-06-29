const mongoose= require('mongoose');
mongoose.connect('mongodb://localhost:27017/ubuddys',{useNewUrlParser:true , useCreateIndex:true,useUnifiedTopology: true,});

var conn =mongoose.Collection;

var UserSechema=new mongoose.Schema({
    username: String ,
    Firstname: String,
    Lastname : String,
    email : String,
    password : String,
    temppassword : String,
    Mobile : Number,
    Addmemory : { type: Number,      
        enum : [0,1],      
        default: 0  
        },
    payment_status : { type: Number,      
            enum : [0,1],      
            default: 0  
            },
    Registerdate: { type: Date, default: Date.now },
    addeddate: String,
    profile_status : { type: Number,      
        enum : [0,1],      
        default: 1  
        },
})


var UserModel = mongoose.model('register', UserSechema);
module.exports= {UserModel,conn};
