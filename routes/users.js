var express = require("express");
var router = express.Router();

const passport = require("passport");

var nodemailer = require("nodemailer");

var { isLoggedIn, whoCanAccess } = require("../middleweres/auth");

let {check,validationResult}=require('express-validator')

var userModel = require("../models/users");
var carModel = require("../models/cars");

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

var GoogleStrategy = require("passport-google-oauth2").Strategy;

let codeG = 1111;

function getRandomInt(max) {
  codeG = Math.floor(Math.random() * max);
}

// Register start

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", 
[
  // check('email',"Email Error").isEmail(),
  // check('username',"Username Not Be Empty").isLength({max:10}),
  // check('password',"password length 0-8").isLength({min:1,max:8})
],
async function (req, res) {
  let { username, email, password, phone, address } = req.body;
  let userData = new userModel({
    username,
    email,
    // password,
    phone,
    address,
  });

  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

// Register Finish

// Login Start

router.get("/login", function (req, res) {
  console.log(req.flash("error"));
  res.render("login", { error: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

// Login Finish

router.get("/change_password", function (req, res) {
  res.render("change_password");
});

router.post("/change_password", async function (req, res) {
  let { new_password, old_password } = req.body;
  let user = await userModel.findOne({ email: req.user.email });
  if (user) {
    user.changePassword(req.body.old_password, req.body.new_password);
    // if (old_password == user.password) {
    //   let data = await userModel.findOneAndUpdate(
    //     { _id: user._id },
    //     { password: new_password }
    //   );
    // }
  }
  res.redirect("/logout");
});

// Forgot Password

router.get("/forgot_password", async function (req, res) {
  res.render("forgot_password");
});

router.post("/forgot_password", async function (req, res) {
  let { email } = req.body;
  //  let code=1111;

  getRandomInt(9999);

  let user = await userModel.findOne({ email: email });

  if (user){

    var trasport=nodemailer.createTransport({
      'service':'gmail',
      auth:{
        user:"krishna.cars.27@gmail.com",
        pass: "ibtmrjzoorzqffka",
      }
    });

    var mailOption={
      from:"krishna.cars.27@gmail.com",
      to:[email],
      subject:"Reset Password",
      html:`<h1>OTP ${codeG} <h1> 
      <mark>Do not share with anyone</mark>
      `
    }

    trasport.sendMail(mailOption,(err,info)=>{
      if(err) throw err
      console.log(info);

    });
  }
  else{
    return res.end("User Not Found");
  }

  res.redirect("/reset_password");
});

router.get("/reset_password", function (req, res) {
  res.render("reset_password");
});

router.post("/reset_password", async function (req, res) {
  let { email, code, password } = req.body;

  if (code == codeG) {
    let user = await userModel.findOne({ email: email }).then(
      function (sanitizedUser) {
        if (sanitizedUser) {
          sanitizedUser.setPassword(password, async function (error,users) {
            await userModel.findOneAndUpdate({email:email},{hash: users.hash, salt: users.salt })
            users.save();
          });
        }
      },
      function (err) {
        console.error(err);
      }
    );

  }

  res.redirect("/login");
});

// Logout Start

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

// Logout Finish

// Google Auth

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/profile",
    failureFlash: true,
  }),
  function (req, res) {}
);

// Google Auth Finish

module.exports = router;
