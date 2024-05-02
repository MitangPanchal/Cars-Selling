var express = require('express');
var router = express.Router();

var url=require('url');

var nodemailer=require('nodemailer');

var {isLoggedIn,whoCanAccess}=require("../middleweres/auth");

var userModel=require("../models/users");
var carModel=require("../models/cars");
var bookingModel=require("../models/service_bookings");

const passport = require('passport');

const localStrategy=require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

var multer=require('multer');
const contactModel = require('../models/contcat');

let storage=multer.diskStorage({
  destination:function(req,file,cb){
    return cb(null,"./public/images/uploads")
  },
  filename:function(req,file,cb){
    return cb(null,file.originalname);
  },
});

let upload=multer({storage});

/* GET home page. */
router.get('/', async function(req, res, next) {
  let carData=await carModel.find({});
  res.render('index',{carData});
});

router.get("/about",isLoggedIn,function(req,res){
  res.render('about');
})
router.get("/contact",isLoggedIn,function(req,res){
  res.render('contact');
})

router.get("/profile",isLoggedIn,async function(req,res){

  let user=await userModel.findOne({email:req.user.email}).populate(['carPurchase','bookings']);

  res.render("profile",{user});
});


router.get("/admin",isLoggedIn,whoCanAccess(["ADMIN"]),async function(req,res){
  let userData=await userModel.find({});
  console.log(userData);
  let issueData=await contactModel.find({});
  console.log(issueData)
  res.render("admin",{issueData,userData});
});



// Car Post Start


  router.get("/carPost",isLoggedIn,async function(req,res){
    let user=await userModel.findOne({email:req.user.email});
    res.render("carSellForm");
  });

  router.post("/carPost",isLoggedIn,upload.fields([{name:'frontImage'},{name:'backImage'},{name:"rightImage"},{name:"leftImage"},{name:"dashboardImage"}]),async function(req,res){

    let user=await userModel.findOne({email:req.user.email});

    let carPostData=await carModel.create({
      user:user._id,
      modelType:req.body.modelType,
      modelName:req.body.modelName,
      transmission:req.body.transmission,
      price:req.body.price,
      brand:req.body.brand,
      kmRun:req.body.kmRun,
      fuleType:req.body.fuleType,
      year:req.body.year,
      carColor:req.body.carColor,
      frontImage:req.files.frontImage[0].filename,
      backImage:req.files.backImage[0].filename,
      rightImage:req.files.rightImage[0].filename,
      leftImage:req.files.leftImage[0].filename,
      dashboardImage:req.files.dashboardImage[0].filename,

    });

    // user.carPost.push(carPostData._id);
    // await user.save();

     res.redirect("/admin");
  });


// Car Post End




router.get("/listing",isLoggedIn,async function(req,res){
  let carData=await carModel.find({}).populate('user');
  res.render("listing",{carData});
});


router.get("/specific_car/:key",async function(req,res){
  let carKey=req.params.key;
  let carData=await carModel.find({}).populate('user');
  res.render("specific_types",{carData,carKey});

});



// Car Service

router.get("/carService",isLoggedIn,async function(req,res){
  res.render("carService");
});

router.post("/carService",isLoggedIn,async function(req,res){
  let user=await userModel.findOne({email:req.user.email});
  // console.log(user)

  let bookingData=await bookingModel.create({
    user:user._id,
    carModel:req.body.carModel,
    modelName:req.body.modelName,
    date:req.body.date,
    phone:req.body.phone,
    email:req.body.email,
    service:req.body.service,
    address:req.body.address,
  });
  user.bookings.push(bookingData._id);
  await user.save();

  var trasport=nodemailer.createTransport({
    'service':'gmail',
    auth:{
        user:"krishna.cars.27@gmail.com",
        pass: "ibtmrjzoorzqffka",
    }
  });

  var mailOption={
    from:"krishna.cars.27@gmail.com",
    to:[req.body.email],
    subject:"Booking Receipt",
    html:`<h1>Your Booking For Car Service Is Done </h1><h2>Your Booking Id Is: ${bookingData._id}<br><a href="http://localhost:3000/carService_Receipt/${bookingData._id}">Click Here To Download Receipt</a>`
}

trasport.sendMail(mailOption,(err,info)=>{
  if(err) throw err
  console.log(info);

})

  res.redirect(`/carService_Receipt/${bookingData._id}`);
})

router.get("/carService_Receipt/:_id",isLoggedIn,async function(req,res){
  let bookingData=await bookingModel.findOne({_id:req.params._id}).populate('user')
  res.render("carService_Receipt",{bookingData});
})
// Car Service End



router.get("/details/:_id",isLoggedIn,async function(req,res){
  let id=req.params._id;
  // console.log(id);
  let detail=await carModel.findOne({_id:id});
  res.render("details",{detail});
});


router.get("/checkout/:_id",isLoggedIn,async function(req,res){
  let id=req.params._id;
  let detail=await carModel.findOne({_id:id});
  res.render('checkout',{detail});
});


// Profile Pages


router.post("/profile/information",async function(req,res){
  let{username,phone,address}=req.body;
  let data=await userModel.findOneAndUpdate({_id:req.user._id},{username:username,phone:phone,address:address});
  res.redirect("/profile")
})

// router.get("/change_password",function(req,res){
//   res.render('change_password')
// })

// router.post("/change_password",async function(req,res){
//   let {new_password,old_password}=req.body
//   let user=await userModel.findOne({email:req.user.email});
//   if(user){
//     if(old_password==user.password){
//      let data=await userModel.findOneAndUpdate({_id:user._id},{password:new_password});
//     }

// }
// res.redirect("/logout");
// })

router.get("/booked_service_by_user",isLoggedIn,async function(req,res){
  let user=await userModel.findOne({email:req.user.email}).populate(['carPurchase','bookings']);
  res.render("booked_service_by_user",{user})
});

router.get("/booked_car_by_user",isLoggedIn,async function(req,res){
  let user=await userModel.findOne({email:req.user.email}).populate(['carPurchase','bookings']);
  res.render("booked_car_by_user",{user})
});


router.post("/contact_us",async function(req,res){
  let data=await contactModel.create({
    user:req.user.email,
    msg:req.body.msg,
  })
  console.log(data)
  res.redirect("/contact")
})

module.exports = router;
