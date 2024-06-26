const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'A review must have a text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'A review must have a rating']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
},
    {
        toJSON: { virtuals: true }, //enabling virtual properties
        toObject: { virtuals: true }
    }
);

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'user',
    //     select: 'name photo'
    // }).populate({
    //     path: 'tour',
    //     select: 'name'
    // })
    // next();
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;