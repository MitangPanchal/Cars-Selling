var express = require('express');
var router = express.Router();

const passport = require('passport');

// var flash = require('express-flash');
var flash=require('connect-flash');

var nodemailer = require("nodemailer");


const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended:false }));

var {isLoggedIn,whoCanAccess}=require("../middleweres/auth");

const paymentController = require('../controllers/paymentController');

var userModel=require("../models/users");
var carModel=require("../models/cars");
const bookingModel = require('../models/service_bookings');
const { default: mongoose } = require('mongoose');
const salesModel = require('../models/sales');
const contactModel = require('../models/contcat');

router.get("/alluserlist",isLoggedIn,whoCanAccess(["ADMIN"]),async function(req,res){
    let userData=await userModel.find({});
    // console.log(userData);
    res.render("alluserlist",{userData});
})

router.get("/products_list",isLoggedIn,whoCanAccess(["ADMIN"]),async function(req,res){
    let productData=await carModel.find({});
    res.render("product_data",{productData});
})




router.get("/bookings",isLoggedIn,whoCanAccess(["ADMIN"]),async function(req,res){
    let bookingData=await bookingModel.find({}).populate('user');
        res.render("admin_bookinglist",{bookingData})
});


router.post("/delete_booking/:_id",async function(req,res){
    let id=req.params._id;
    
    let data=await bookingModel.findOneAndUpdate({_id:id},{serviced: "YES"});
    console.log("Data",data);

    return res.redirect("/bookings");
});

router.post("/deleteproduct/:_id",async function(req,res){
    let data=await carModel.findOneAndDelete({_id:req.params._id});
    console.log(data);

    res.redirect("/products_list")
})

router.get("/completed_services",isLoggedIn,whoCanAccess(["ADMIN"]),async function(req,res){
  
    let completedData=await bookingModel.find({}).populate('user');
        res.render('completed_services_list',{completedData})

})

// 


router.post("/checkout/:_id",paymentController.createOrder)


router.get("/sales/:_id",isLoggedIn,async function(req,res){
       
    // console.log("Order Id",req.params.order_id);
  
    let data=await carModel.findOneAndUpdate({_id:req.params._id},{saled:"YES", purchaseowner:req.user._id});
    let user=await userModel.findOne({_id:req.user._id})
    user.carPurchase.push(req.params._id)
    await user.save();

    let cardetail=await carModel.findOne({_id:req.params._id});

    var trasport=nodemailer.createTransport({
        'service':'gmail',
        auth:{
            user:"krishna.cars.27@gmail.com",
            pass: "ibtmrjzoorzqffka",
        }
    });
    
    var mailOption={
        from:"krishna.cars.27@gmail.com",
        to:[user.email],
        subject:"Book A Car",
        html:`<h1>Congratulation You Have Successfully Booked A Car <h1> 
        <mark>Download Your Receipt  <a href="http://localhost:3000/carBook_receipt/${cardetail._id}">Click Here To Download Receipt</a></mark>
        `
    }
    
    trasport.sendMail(mailOption,(err,info)=>{
        if(err) throw err
        console.log(info);
        
    });

   
    res.render('carBook_receipt',{cardetail,user});
    // res.json({
    //     data
    // })
});

// 

router.get("/sales_data",isLoggedIn,whoCanAccess(["ADMIN"]),async function(req,res){
    let data=await carModel.find({}).populate('purchaseowner');
    let bookingData=await bookingModel.find({}).populate('user');
    res.render("sales_data",{data,bookingData});
})

router.get("/edit_product/:_id",async function(req,res){
    let data=await carModel.findOne({_id:req.params._id});
    res.render("edit_product",{data});
});

router.post("/edit_product/:_id",async function(req,res){
    let {modelType,modelName,transmission,price,kmRun,fuleType,year,brand,carColor}=req.body;
    let data=await carModel.findOneAndUpdate({_id:req.params._id},{modelType:modelType,modelName:modelName,transmission:transmission,price:price,kmRun:kmRun,carColor:carColor,brand:brand,year:year,fuleType:fuleType});
    res.redirect("/admin")
});


router.post("/delete_user/:_id",async function(req,res){
    let data=await userModel.findOneAndDelete({_id:req.params._id});
    res.redirect("/alluserlist");
});

router.post("/delete_msg/:_id",async function(req,res){
    let data=await contactModel.findByIdAndDelete({_id:req.params._id});
    res.redirect("/admin");

});

router.get("/cancel_service/:_id",async function (req,res){
    let user=await bookingModel.findOne({_id:req.params._id});

    if(user){

        var trasport=nodemailer.createTransport({
            'service':'gmail',
            auth:{
                user:"krishna.cars.27@gmail.com",
                pass: "ibtmrjzoorzqffka",
            }
        });
        
        var mailOption={
            from:"krishna.cars.27@gmail.com",
            to:[user.email],
            subject:"Cancel Car Service Booking",
            html:`<h1>Sorry, Your Car Service Booking Has Been Cancel By Krishna Cars. <h1> 
            <mark>Try again booking after some time</mark>
            `
        }
        
        trasport.sendMail(mailOption,(err,info)=>{
            if(err) throw err
            console.log(info);
            
        });
    }
        
    let data=await bookingModel.findByIdAndDelete({_id:req.params._id});

    res.redirect("/bookings");
})

router.get("/test",function(req,res){
    let username=req.flash('user');
    res.render("test",{username})
   
})
router.post("/test",function(req,res){
    req.flash('user',req.body.username)
    res.redirect("/test");
})



module.exports = router;