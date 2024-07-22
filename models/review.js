const mongoose = require('mongoose');
const schema = mongoose.Schema;

const reviewSchema = new schema({
    body:String,
    author: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    rating:{
        type: Number,
        require:true
    }
})
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;