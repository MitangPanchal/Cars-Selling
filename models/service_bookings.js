
var mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/krishna_cars1");

let bookingSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    carModel:{
        type:String,
    },
    modelName:{
        type:String,
    },
    date:{
        type:Date,
    },
    phone:{
        type:Number,
    },
    email:{
        type:String,
    },
    service:{
        type:String,
    },
    address:{
        type:String,
    },
    serviced:{
        type:String,
        default: "NO"
    }
})

var bookingModel=mongoose.model("Book",bookingSchema);

module.exports=bookingModel;