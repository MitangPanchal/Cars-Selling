var mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/krishna_cars1");

let salesSchema=mongoose.Schema({
    sales:[
        {
           type:String
        }
    ],
    checkout_email:{
        type:String,
    },
    checkout_phone:{
        type:String,
    },
    checkout_name:{
        type:String,
    },
    checkout_address:{
        type:String,
    },
    checkout_city:{
        type:String,
    },
    checkout_postal:{
        type:Number
    },

})

let salesModel=mongoose.model('Sales',salesSchema)

module.exports=salesModel;