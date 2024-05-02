// var flash = require('express-flash');

var flash=require('connect-flash');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter=require("./routes/admin");

var userModel=require("./models/users");

var session=require('express-session')

const passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const db = mongoose.connection;

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:"Mitang",
  cookie: {maxAge: 60000*60*24*30,secure:false}, // 30 days   60000 * 60 * 24 * 30
  store: new MongoStore({ mongoUrl: db.client.s.url })
}));




app.use(passport.initialize());
app.use(passport.session());




passport.use(new GoogleStrategy({
  clientID:"",
  clientSecret:"",
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback : true
},
 async function(request, accessToken, refreshToken, profile, cb) {
  console.log(profile.given_name);
  let user=await userModel.findOne({email:profile.email});
  if(!user){
    let data=await userModel.create({
      username:profile.given_name,
      email:profile.email,
    })
  }

  return cb(null,profile)
  
}
));

passport.serializeUser(function(user,cb){
  cb(null,user)
});
passport.deserializeUser(function(obj,cb){
  cb(null,obj)
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use("/",adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
