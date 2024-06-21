const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModels');

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