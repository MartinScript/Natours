const multer = require('multer');
const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModels');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getMe = (req, res, next) => {
    req.params.id = user.id;
    next();
};

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.startsWith('images')) {
        cb(null, true);
    }
    else {
        cb(new AppError('Not an image please upload only images'), false);
    }
};

const upload = multer({
    destination: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    sharp(ref.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`/public/img/users/${req.file.filename}`);
    next();
}

const filteredObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (allowedFields.includes(key)) newObj[key] = obj[key];
    });
    return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
    //create error if user post password
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPasswords instead.', 400));
    }
    //filtered unwanted fieldnames not allowed to be updated
    const filteredBody = filteredObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;
    //update user document
    const updatedUser = await User.findByIdAndUpdate(req.body.id, filteredBody, {
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