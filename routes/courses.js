const express = require('express');
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const router = express.Router({ mergeParams: true });
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');
const { protect, authotize } = require('../middleware/auth');
router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, authotize('publisher', 'admin'), addCourse);

router.route('/:id').get(getCourse).put(protect, authotize('publisher', 'admin'), updateCourse).delete(protect, authotize('publisher', 'admin'), deleteCourse);

module.exports = router;
