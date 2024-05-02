
var mongoose=require('mongoose');
var plm=require('passport-local-mongoose');

mongoose.connect("mongodb://localhost:27017/krishna_cars1");

let userSchema=mongoose.Schema({
    email:{
        type:String,
        unique:true,
    },
    username:{
        type:String,
    },
    password:{
        type:String,
    },
    phone:{
        type:Number,
    },
    address:{
        type:String,
    },
    role:{
        type:String,
        default:"NORMAL",
    }, 
    carPurchase:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Car'
        }
    ],
    bookings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Book',
        }
    ],
    forgot_code:{
        type:String,
        defalut:''
    }
});
userSchema.plugin(plm);

let userModel=mongoose.model('User',userSchema);

module.exports=userModel;