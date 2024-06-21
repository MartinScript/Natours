const express = require('express');
const userController = require('./../controllers/userContoller');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router.route('/:id').get(userController.getUser).delete(userController.deleteUser).patch(userController.updateUser);

module.exports = router;