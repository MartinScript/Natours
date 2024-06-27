const mongoose = require('mongoose');
const Tour = require('./tourModels');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'A review must have a text']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
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

//unique review for tour and user
reviewSchema.index({ user: 1, tour: 1 }, {
    unique: true
});

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

//Calculating average rating after creating and deleting reviews
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRatings: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRatings,
        ratingsAverage: stats[0].avgRating
    });
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;