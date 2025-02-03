const { date } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema= new mongoose.Schema({
    Comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created_At:{
        type:Date,
        default:Date.now()
    }
})
module.exports=mongoose.model("Reviews",ReviewSchema);