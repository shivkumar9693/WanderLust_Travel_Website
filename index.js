const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
var methodOverride = require('method-override')
engine = require('ejs-mate');
const wrapAsync=require("./util/wrapAsync.js");
const ExpressError=require("./util/ExpressError.js");
const {ListingSchema}=require("./ErrorSchema.js");

//middleware
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'))
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));
//db setup
main().then(()=>{
    console.log("DB Connnected");
}).catch((er)=>{
    console.log(er);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.get("/",(req,res)=>{
    res.send("root");
})
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
app.get("/listing",wrapAsync(async(req,res)=>{
   let allListing= await Listing.find({});
   res.render("listing/index.ejs",{allListing});
}))
//new route
app.get("/listing/new",(req,res)=>{
     res.render("listing/new.ejs");
  });
//read route
app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listing/show.ejs",{listing});

}))
//create route
app.post("/listing",validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
}));

//edit route
app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    
    res.render("listing/edit.ejs",{listing});
}))
//put route
app.put("/listing/:id",validateListing,wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listing/${id}`);

}))
//delet route
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id,{...req.body.listing});
    res.redirect("/listing");

}))
//for all route if not matched
app.use("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})
//error handler
app.use((err,req,res,next)=>{
     let{status=5000,message="something went wrong"}=err;
    res.render("error.ejs",{message});
})

//server
app.listen(8000,()=>{
    console.log("server running on port 8000");

})
