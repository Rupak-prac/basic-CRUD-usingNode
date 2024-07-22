const mongoose = require('mongoose');
const Review = require('./review')
const User = require('./users')
const schema = mongoose.Schema;


const houseSchema = new schema({
    location:{
        type:String,
        required:true,
    },
    price:{
        type: Number,
        min: 0,
    },
    description:String,
    houseType:String,
    image: String,
    size: Number,
    rooms: Number
})

module.exports = mongoose.model('House', houseSchema);