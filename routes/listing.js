const express=require("express");
const route=express.Router();
const {ListingSchema}=require("../ErrorSchema.js");
const Listing = require("../models/listing.js");
const ExpressError=require("../util/ExpressError.js");
const wrapAsync=require("../util/wrapAsync.js");
//validate listing for joi error
const validateListing=(req,res,next)=>{
    let {error} = ListingSchema.validate(req.body);
    if (error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}
//index route
 route.get("/",wrapAsync(async(req,res)=>{
    let allListing= await Listing.find({});
    res.render("listing/index.ejs",{allListing});
 }))
 //new route
  route.get("/new",(req,res)=>{
      res.render("listing/new.ejs");
   });
 //read route
 route.get("/:id",wrapAsync(async(req,res)=>{
     let{id}=req.params;
     const listing=await Listing.findById(id).populate("reviews");
     res.render("listing/show.ejs",{listing});
 
 }))
 
//create route
route.post("/",validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
}));

//edit route
route.get("/:id/edit",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    
    res.render("listing/edit.ejs",{listing});
}))
//put route
route.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listing/${id}`);

}))
//delet route
route.delete("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id,{...req.body.listing});
    res.redirect("/listing");

}))

module.exports=route;