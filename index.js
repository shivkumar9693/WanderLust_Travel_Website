const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
 var methodOverride = require('method-override')
engine = require('ejs-mate');
 const ExpressError=require("./util/ExpressError.js");
 const listing=require("./routes/listing.js");
 const reviews=require("./routes/reviews.js");

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
app.use("/listing",listing);
app.use("/listing/:id/review",reviews);





//for all route if not matched
app.use("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})
//error handler
app.use((err,req,res,next)=>{
     let{status=500,message="something went wrong"}=err;
    res.render("error.ejs",{message});
})

//server
app.listen(8000,()=>{
    console.log("server running on port 8000");

})
