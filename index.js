const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
var methodOverride = require('method-override')
engine = require('ejs-mate');

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
//index route
app.get("/listing",async(req,res)=>{
   let allListing= await Listing.find({});
   res.render("listing/index.ejs",{allListing});
})
//new route
app.get("/listing/new",(req,res)=>{
     res.render("listing/new.ejs");
  });
//read route
app.get("/listing/:id",async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listing/show.ejs",{listing});

})
//create route
app.post("/listing",(req,res)=>{
    let newListing=Listing(req.body.listing);
    newListing.save();
    res.redirect("/listing");
})
//edit route
app.get("/listing/:id/edit",async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    
    res.render("listing/edit.ejs",{listing});
})
//put route
app.put("/listing/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
     res.redirect(`/listing/${id}`);

})
//delet route
app.delete("/listing/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id,{...req.body.listing});
    res.redirect("/listing");

})



//server
app.listen(8080,()=>{
    console.log("server running on port 8080");

})
