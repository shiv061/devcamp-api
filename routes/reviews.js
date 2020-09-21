const express = require('express');
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviews');
const router = express.Router({ mergeParams: true });
const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResults');
const { protect, authotize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authotize('user', 'admin'), addReview);

router.route('/:id').get(getReview).put(protect, authotize('user', 'admin'), updateReview).delete(protect, authotize('user', 'admin'), deleteReview);

module.exports = router;
