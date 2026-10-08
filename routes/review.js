const express = require("express");
const router = express.Router({mergeParams:true});
const  ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review =require("../models/reviews.js");
const Listing =require("../models/listing.js");
const {validateReview,isLoggedIn, isreviewAuthor,} = require("../middleware.js") ;


const reviewController = require("../controllers/reviews.js");
//Reviews
//Post Route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

//delete review route
//DELETE ROUTE
router.delete("/:reviewId" ,
    isLoggedIn,isreviewAuthor,
    wrapAsync (reviewController.destroyReview));
module.exports = router;