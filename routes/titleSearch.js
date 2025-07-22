const express = require("express");
const router = express.Router();
const Listings = require("../Models/listings");

// Search Route - Find listings based on title keyword
router.get("/search", async (req, res) => {
    try {
        const { query } = req.query; // Extract search term from query params
        console.log("Search Query:", query);
        if (!query) {
            req.flash("err", "Please enter a search term.");
            return res.redirect("/listings");
        }

        // MongoDB regex search (case-insensitive)
        const allListings = await Listings.find({
            title: { $regex: query, $options: "i" }
        });

        if (allListings.length === 0) {
            req.flash("err", "No listings found!");
            return res.redirect("/listings");
        }

        res.render("listings/index", { allListings }); // Render the search results
    } catch (error) {
        console.error("Search Error:", error);
        req.flash("err", "Something went wrong.");
        res.redirect("/listings");
    }
});

module.exports = router;
