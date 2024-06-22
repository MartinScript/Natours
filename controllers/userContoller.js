const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModels');
const AppError = require('./../utils/appError');

const filteredObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (allowedFields.includes(key)) newObj[key] = obj[key];
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: users.length,
        data: {
            users
        }
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    //create error if user post password
    if (req.body.password || req.body.passwordCurrent) {
        return next(new AppErrror('This route is not for password updates. Please use /updateMyPasswords instead.', 400));
    }
    //filtered unwanted fieldnames not allowed to be updated
    const filteredBody = filteredObj(req.body, 'name', 'email');
    //update user document
    updatedUser = await User.findByIdAndUpdate(req.body.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(200).json({
        status: 'success',
        data: null
    })
})

exports.getUser = (req, res) => {
    req.status(500).json({ status: 'error', message: 'this url is not yet defined' });
};

exports.deleteUser = (req, res) => {
    req.status(500).json({ status: 'error', message: 'this url is not yet defined' });
};

exports.updateUser = (req, res) => {
    req.status(500).json({ status: 'error', message: 'this url is not yet defined' });
};

exports.createUser = (req, res) => {
    req.status(500).json({ status: 'error', message: 'this url is not yet defined' });
};