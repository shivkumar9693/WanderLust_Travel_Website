const express=require("express");
const route=express.Router({mergeParams:true});
const Reviews = require("../models/reviews.js");
 const wrapAsync=require("../util/wrapAsync.js");
const {ReviewSchema}=require("../ErrorSchema.js");
const ExpressError=require("../util/ExpressError.js");
const Listing = require("../models/listing.js");
//validate rebiews shcema
const validateReview = (req, res, next) => {
    let { error } = ReviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
//Reviews
//post
//some error in server side validation
route.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let userreview=new Reviews(req.body.review);
     listing.reviews.push(userreview);
    await userreview.save();
    await listing.save();
    res.redirect(`/listing/${listing._id}`);

}));
//delete reviews
route.delete("/:reviewId",wrapAsync( async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
}));
module.exports=route;