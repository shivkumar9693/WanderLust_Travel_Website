const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
main().then(()=>{
    console.log("DB Connnected");
}).catch((er)=>{
    console.log(er);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

// Convert sample data to match the Mongoose schema
const convertedListings = initData.data.map(listing => ({
  title: listing.title,
  description: listing.description,
  image: listing.image.url,  
  price: listing.price,
  location: listing.location,
  country: listing.country
}));

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(convertedListings).then((data)=>{console.log(data);
  }).catch((er)=>{
    console.log(er);
  })
  console.log("data was initialized");
};

initDB();
 
 