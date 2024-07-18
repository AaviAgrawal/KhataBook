const jwt = require("jsonwebtoken");
const userModel = require("../models/users-model");

module.exports.isLoggedIn = async function(req,res,next){
    if(req.cookies.token){
        try{
            let decoded = jwt.verify(req.cookies.token,process.env.JWT_SECRET);
            let user = await userModel.findOne({email:decoded.email});
            req.user = user;
            next();
        }catch(err){
            res.redirect("/");
        }
    }
    else{
        return res.redirect("/");
    }
}

module.exports.redirectIfLoggedIn = function(req,res,next){
    if(req.cookies.token){
        try{
            jwt.verify(req.cookies.token,process.env.JWT_SECRET);
            res.redirect("/profile");
        }catch(err){
            return next();
        }
    }
    else return next();
}