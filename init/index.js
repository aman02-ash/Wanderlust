const mongoose = require("mongoose");
const Listings = require("../Models/listings.js");
const initData = require("./data.js");

const Mongo_url = "mongodb://127.0.0.1:27017/WanderLust";

// Calling the main function to build connection with database:

main()
    .then(() =>{
        console.log("Connected to DB");
    })
    .catch((err) =>{
        console.log(err);
    })

// Creating the function for connecting the database:

async function main(){
    await mongoose.connect(Mongo_url);
}

const initDb = async () => {
    await Listings.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj,owner :"66d74e741b324ecffbc4415d" }))
    await Listings.insertMany(initData.data);
    console.log("data initialized");
}

initDb();