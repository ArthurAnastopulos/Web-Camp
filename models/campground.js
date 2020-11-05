const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
})

module.exports = moongoose.model('Campground', CampgroundSchema);