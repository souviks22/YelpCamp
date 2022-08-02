const Campground = require('../models/Campground');
const Review = require('../models/Review');
const catchAsync = require('../errors/catchAsync');

const newReview = catchAsync(async (req, res, next) => {
    const review = new Review({ ...req.body.review, author: req.user._id });
    await review.save();
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    camp.reviews.unshift(review);
    await camp.save();
    req.flash('success', `Successfully posted a review`);
    res.redirect(`/campgrounds/${id}`)
})

const deleteReview = catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: review._id } });
    req.flash('error', `Successfully deleted a review`);
    res.redirect(`/campgrounds/${id}`)
})

module.exports = { newReview, deleteReview }