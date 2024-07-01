const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModels');
const AppError = require('./../utils/appError');

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    res.status(200).render('tour', {
        title: tour.name,
        tour
    });
});

exports.getOverview = catchAsync(async (req, res, next) => {
    //Get tour data from collection
    const tours = await Tour.find();

    //Build template

    //Render template
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

exports.getLoginForm = (req, res, next) => {


    res.status(200).render('login', {
        title: 'Login into your account',
    });
};

exports.getAccount = (req, res, next) => {


    res.status(200).render('account', {
        title: 'Your account'
    });
};
