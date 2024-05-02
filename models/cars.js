
var mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/krishna_cars1");

let carSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    modelType:{
        type:String,
    },
    modelName:{
        type:String
    },
    transmission:{
        type:String,
    },
    price:{
        type:Number,
    },
    kmRun:{
        type:Number,
    },
    fuleType:{
        type:String,
    },
    year:{
        type:String,
    },
    brand:{
        type:String,
    },
    carColor:{
        type:String,
    },
    frontImage:{
        type:String,
    },
    backImage:{
        type:String,
    },
    rightImage:{
        type:String,
    },
    leftImage:{
        type:String,
    },
    dashboardImage:{
        type:String,
    },
    saled:{
        type:String,
        default:"NO",
    },
    purchaseowner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

});

var carModel=mongoose.model("Car",carSchema);

module.exports=carModel;
