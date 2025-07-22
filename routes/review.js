const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../Models/reviews.js");
const Listings = require("../Models/listings.js");
const {isLoggedIn} =require("../middleware.js");
const reviews = require("../Models/reviews.js");

// Review
// Add Review  Route

router.post("/",isLoggedIn,async(req,res)=>{
    let listings = await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listings.reviews.push(newReview);
    
    await newReview.save();
    await listings.save();
    req.flash("success", "Review Added!");
    res.redirect(`/listings/${listings._id}`);
})


// Delete Review Route
router.delete("/:reviewId", isLoggedIn, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // Find the review by ID and populate the author field
    const review = await Review.findById(reviewId).populate('author');

    if (!review) {
        req.flash("err", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    // Check if the logged-in user is the author of the review
    if (req.user._id.equals(review.author._id)) {
        // Remove the review from the listing
        await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        // Delete the review from the database
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted!");
    } else {
        req.flash("err", "You don't have permission to delete this review.");
    }

    res.redirect(`/listings/${id}`);
}));


module.exports = router;