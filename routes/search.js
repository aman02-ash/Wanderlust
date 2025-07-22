const express = require("express");
const router = express.Router();
const Listings = require("../Models/listings.js");
// const {isLoggedIn} = require("../middleware.js");

router.get("/listings/search",async(req,res)=>{
    let searchQuery = req.query.q;
    console.log(searchQuery);

    try {
        // Perform a case-insensitive search on the 'title' field using regex
        const listings = await Listings.find({
          title: { $regex: searchQuery, $options: "i" },
        });
    
        // Check if any listings were found
        if (listings.length === 0) {
          return res.status(404).json({ message: "No listings found for this search query" });
        }
    
        // Send the matching listings back to the client as a JSON response
        res.json(listings);
      } catch (error) {
        // Handle errors that occur during the search operation
        console.error("Error occurred during search: ", error);
        res.status(500).json({ message: "Server error occurred while searching for listings" });
      }
    });
    
    module.exports = router;