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
        set: (v) => v === "" ? "https://th.bing.com/th/id/OIP.Bf6N5Uj6Yonzi7tqh_SkygHaEK?rs=1&pid=ImgDetMain" : v,
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
