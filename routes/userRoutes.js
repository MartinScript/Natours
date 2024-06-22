const express = require('express');
const userController = require('./../controllers/userContoller');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/resetPassword/:token', authController.resetPassword);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/updateMyPassword', authController.protect, authController.updatePassword);
router.patch('/updateMe', authController.protect, authController.updateMe);

router.route('/')
    .get(authController.protect, userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);

module.exports = router;