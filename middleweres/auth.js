var userModel=require("../models/users");

function isLoggedIn(req,res,next){

    if(req.isAuthenticated()) {
        req.user=req.session.passport.user
        return next();
    }
    res.redirect("/login");
  }

  function whoCanAccess(role){
    return async function(req,res,next){
        let user=await userModel.findOne({username:req.user});

        if(!role.includes(req.user.role)) return res.redirect("/");

            return next();
       
    }
  }

module.exports={
    isLoggedIn,
    whoCanAccess,
}