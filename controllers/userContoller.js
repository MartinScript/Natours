const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModels');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filteredObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (allowedFields.includes(key)) newObj[key] = obj[key];
    });
    return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
    //create error if user post password
    if (req.body.password || req.body.passwordCurrent) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPasswords instead.', 400));
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
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);

exports.createUser = (req, res) => {
    req.status(500).json({ status: 'error', message: 'this url is not defined, Please use /signup instead' });
};