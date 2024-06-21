const mongoose = require('mongoose');
// const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must be at most 40 characters'],
        minlength: [10, 'A tour name must be at at least 10 characters']
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        summary: {
            type: String,
            trim: true,
        },
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: 'Discount ({VALUE}) must be below regular price'
        }
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Ratings must be above 1.0'],
        max: [5, 'Ratings must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty must be either easy, medium or difficult'
        }
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    secretTour: {
        type: Boolean,
        default: false,
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
}, {
    toJSON: { virtuals: true }, //enabling virtual properties
    toObject: { virtuals: true }
}
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});
//Mongoose Middleware
// tourSchema.pre('save', function (next) {
//     this.slug = slugify(this.name, { toLower: true });
//     next();
// });

tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (doc, next) {
    console.log(`query took ${Date.now() - this.start} milliseconds`);
    console.log(docs);
    next();
});

tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { $secretTour: { $ne: true } } });
    console.log(this.pipeline()); t
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;