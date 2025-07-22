const mongoose = require("mongoose");
const Review = require("./reviews.js");
const reviews = require("./reviews.js");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : String,
    description :String,
    image : {
        filename: { type: String ,default: "default-filename.jpg" },
        url : {
            type : String,
            default:"https://images.unsplash.com/photo-1465301055284-72f355cfd745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvdXNlfGVufDB8fDB8fHww",
        }
    },
    price : {
      type : Number,
      require : true,  
    },
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews }});
    }
})

const Listings = mongoose.model("Listings", listingSchema);
module.exports = Listings;





