const Razorpay = require('razorpay'); 
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

var userModel=require("../models/users");
var carModel=require("../models/cars");
const bookingModel = require('../models/service_bookings');
const salesModel = require('../models/sales');

const razorpayInstance = new Razorpay({
    key_id: "rzp_test_b4uwOTKnvRfiQ6",
    key_secret: "JSJBP3CzE8T3YLh6rdckksWh"
});



const createOrder = async(req,res)=>{
    console.log(req.user);
    try {
        const amount = req.body.amount*100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'panchalmitang01@gmail.com'
        }


      razorpayInstance.orders.create(options, 
        async (err, order)=>{
                if(!err){
                   
                    res.status(200).send({
                        success:true,
                        msg:'Order Created',
                        order_id:order.id,
                        amount:amount,
                        key_id:"rzp_test_b4uwOTKnvRfiQ6",
                        product_name:req.body.name,
                        description:req.body.description,
                        contact:req.body.checkout_phone,
                        name: req.user.username,
                        email: req.user.email,
                    })
                }

                else{
                    console.log(err)
                }
                        
                    
            }
        );
            

       
            } catch (error) {
                console.log(error.message);
    }
    
            
        
}


module.exports = {
    createOrder
}