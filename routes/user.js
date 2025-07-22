const express = require("express");
const { default: mongoose } = require("mongoose");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../Models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");


//Signup

router.get("/signup",(req,res)=>{
    res.render("listings/signup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
        let { username , email , password } = req.body;
        const newUser =  new User ({username , email});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.logIn(registeredUser,((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Registered successfully");
            res.redirect("/listings");
        }))
    }
    catch(e){
            console.log(e.message);
            req.flash("err",e.message);
            res.redirect("/signup");
        }
    
});

//Login

router.get("/login",(req,res)=>{
    res.render("listings/login.ejs");
})

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), async (req, res) => {
    try {
        req.flash("success", "Welcome back to WanderLust!");
        const redirectUrl = res.locals.redirectUrl || "/listings";
        delete req.session.redirectUrl; // Clear the redirectUrl from session after use
        res.redirect(redirectUrl);
    } catch (e) {
        console.log(e.message);
    }
});


// Log Out

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","Logged out successfully");
            res.redirect("/listings");
        }
    })
})

module.exports = router;