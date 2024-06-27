const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();
//param middleware
// router.param('id', tourController.checkID);

//For nested route
router.use('/:tourId/reviews', reviewRouter);

router.route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.createTour);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

router.route('/tours-within/:distance/center/:lng,lat/unit/:unit').get(tourController.getToursWithin);
router.route('/distances/:lng,lat/unit/:unit').get(tourController.getDistances);

router.route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        tourController.updateTour,)
    .delete(authController.protect,
        authController.restrictTo('admin'),
        tourController.deleteTour);

module.exports = router;