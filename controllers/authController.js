const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModels');
const AppError = require('./../utils/appError');

const signToken = (id) => {
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    };

    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        token,
    });
});

const protect = catchAsync(async (req, res, next) => {
    //1, Get token and check presence
    let token;
    if (req.headers.authorization && req.headers.authorization.StartWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You must be logged in, Please log in to get access', 401));
    }
    //Verifytoken
    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //check if user exists
    const currentUser = await User.findById(decodedToken.id);
    if (!currentUser) {
        return next(new AppError('The user attached to this token does not exist', 401));
    }
    //Check if user changed password after token was issued
    if (currentUser.changedPasswordAt(decoded.iat)) {
        return next(new AppError('User recently changed password, log in again', 401));
    }
    request.user = currentUser;
    next();
});
