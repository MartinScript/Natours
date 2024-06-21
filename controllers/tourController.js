const fs = require('fs');

const catchAsync = require('./../utils/catchAsync');
const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apiFeatures');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage, price';
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
    next();
};

exports.getAllTours = catchAsync(async (req, res) => {
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
});

exports.getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        return next(new AppError('No tour found with that id', 404));
    };
    res.status(200).json({
        status: 'success',
        data: { tour }
    });
});

exports.createTour = catchAsync(async (req, res) => {
    //const newTour = new Tour({});
    //newTour.save();
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { tour: newTour }
    });

});

exports.updateTour = catchAsync(async (req, res) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(204).json({
        status: 'success',
        data: {
            tour
        }
    });
});

exports.deleteTour = catchAsync(async (req, res) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        return next(new AppError('No tour found with that id', 404));
    };
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getTourStats = catchAsync(async (req, res) => {
    const stats = await Tour.aggregate([
        { $match: { ratingsAverage: { $gte: 4.5 } } },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: 'ratingsQuantity' },
                avgRatings: { $avg: 'ratingsAverage' },
                avgPrice: { $avg: 'price' },
                minPrice: { $min: 'price' },
                maxPrice: { $max: 'price' }
            }
        },
        { $sort: { avgprice: 1 } }
        // { $match: { _id: { $ne: 'EASY' } } }
    ])
    res.status(200).json({
        status: 'success',
        data: { stats }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
    const year = req.params.year * 1;
    const plan = await Tours.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                $startDates:
                {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStart: { $sum: 1 },
                tours: { $push: '$name' }
            },
        },
        {
            $addFields:
            {
                $month: '$_id'
            }
        },
        {
            $project: { $_id: 0 }
        },
        {
            $sort: { $numTourStart: -1 }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: { stats }
    });
});