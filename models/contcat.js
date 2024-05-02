var mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/krishna_cars1");

let contactSchema=mongoose.Schema({
    
    user:{
        type:String,
    },
    msg:{
        type:String,
    }

})

let contactModel=mongoose.model('contact_us',contactSchema)

module.exports=contactModel;