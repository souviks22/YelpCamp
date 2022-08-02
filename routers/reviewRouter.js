const express = require('express');
const reviewRouter = express.Router({ mergeParams: true });
const { isSignedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


reviewRouter.post('/reviews', isSignedIn, validateReview, reviews.newReview)
reviewRouter.delete('/reviews/:reviewId', isSignedIn, isReviewAuthor, reviews.deleteReview)

module.exports = reviewRouter