//joi from npm
const Joi = require('joi');
const reviews = require('./models/reviews');

module.exports.ListingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required()
});

module.exports.ReviewSchema=Joi.object({
    
        review: Joi.object({
            Comment: Joi.string().required(), // Capitalized "C"
            rating: Joi.number().min(1).max(5).required(),
        }).required(),
        
});