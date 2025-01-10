const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        set: (v) => v === "" ? "https://unsplash.com/photos/a-building-with-many-windows-by-water-Af8rY90C3e8" : v,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
});

let Listing = mongoose.model("Listing", listingSchema);

module.exports=Listing;
