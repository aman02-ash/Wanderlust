
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExressError = require("../utils/ExpressErrors.js");
// const{listingSchema , reviewSchema} = require("../schema.js");
const Listings = require("../Models/listings.js");
const {isLoggedIn} = require("../middleware.js");
// const multer  = require('multer');
// const {storage} = require("../cloudConfig.js");
// const upload = multer({ storage });

// Index Route 
router.get("/",wrapAsync (async(req,res)=>{
    const allListings = await Listings.find({});
    res.render("listings/index.ejs",{allListings});
}));

// New Route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/create.ejs");
})

//Show Route
router.get("/:id", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listings.findById(req.params.id)
    
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs" ,{listing});
}))

// Create Route
router.post("/",wrapAsync(async(req,res)=>{
    // let url = req.file.path;
    // let filename = req.file.filename;
    // console.log(url,"..",filename);
    let newlisting = new Listings(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
 }))
 
 
 // Update Route
 router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
     const {id} = req.params;
     const listing = await Listings.findById(id);
     res.render("listings/update.ejs",{listing});
 }))
 
 //Update Route
 router.put("/:id", wrapAsync(async(req,res)=>{
     let { id } = req.params;
     await Listings.findByIdAndUpdate(id,{ ...req.body.listing});
     req.flash("success", "Listing Updated!");
     res.redirect(`/listings/${id}`);
 }))
 
 //Delete Route
 router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
     let { id } = req.params;
     await Listings.findByIdAndDelete(id,{ ...req.body.listing});
     req.flash("success", "Listing Deleted!");
     res.redirect("/listings");
 }))
 

module.exports= router;