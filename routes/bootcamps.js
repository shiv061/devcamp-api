const express = require('express');
const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampUpload } = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

const advancedResults = require('../middleware/advancedResults');

const courseRouter = require('./courses');

const router = express.Router();

const { protect, authotize } = require('../middleware/auth');

// Re-route to other resourse routers

router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, authotize('publisher', 'admin'), createBootcamp);

router.route('/:id').get(getBootcamp).put(protect, authotize('publisher', 'admin'), updateBootcamp).delete(protect, authotize('publisher', 'admin'), deleteBootcamp);

router.route('/:id/photo').put(protect, authotize('publisher', 'admin'), bootcampUpload);

module.exports = router;
