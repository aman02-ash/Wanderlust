// if(process.env.NODE_ENV != "production"){
//     require('dotenv').config();
// }

// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listings = require("./Models/listings.js");
const path = require("path");
const { title } = require("process");
const methodOverRide = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExressError = require("./utils/ExpressErrors.js");
// const{listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./Models/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");
const { serialize } = require("v8");

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const searchRout = require("./routes/search.js");
const titleSearch = require("./routes/titleSearch.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverRide("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// Creating url to connect with database from the mongoose WebTransportBidirectionalStream:-
const Mongo_url = "mongodb://127.0.0.1:27017/WanderLust";

// Calling the main function to build connection with database:
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// Creating the function for connecting the database:
async function main() {
  await mongoose.connect(Mongo_url);
}

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,

  Cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("Working");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.err = req.flash("err");
  res.locals.currUser = req.user;

  next();
});

// app.get("/demouser",async(req,res)=>{
//     const fakeUser = new User({
//         email : "abc@gamil.com",
//         username : "@Demouser"
//     })
//     let newUser = await User.register(fakeUser,"hello123");
//     res.send(newUser);
// })

app.use("/listings", listingsRoute);
app.use("/listings/:id/review", reviewsRoute);
app.use("/", userRoute);
app.use("/", titleSearch);

app.all("*", (req, res, next) => {
  next(new ExressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  // res.status(statusCode).send(message);
  res.render("listings/error.ejs", { message });
});

app.listen(port, (req, res) => {
  console.log("Server is listening on port :8080");
});
