const Campground = require('./models/Campground');
const Review = require('./models/Review');
const { campValid, reviewValid } = require('./joi-validity');
const catchAsync = require('./errors/catchAsync');
const AppError = require('./errors/AppError');

const isSignedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnUrl = req.originalUrl;
        req.flash('error', 'Not Signed In');
        res.redirect('/signin')
    }
    else next()
}

const validateCamp = (req, res, next) => {
    const { error } = campValid.validate(req.body.campground);
    if (error) {
        const message = error.details.map(detail => detail.message + ' => ' + detail.context.value).join('\n');
        throw new AppError(message, 400);
    }
    next()
}

const validateReview = (req, res, next) => {
    const { error } = reviewValid.validate(req.body.review);
    if (error) {
        const message = error.details.map(detail => detail.message + ' => ' + detail.context.value).join('\n');
        throw new AppError(message, 400);
    }
    next()
}

const isCampAuthor = catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id).populate('author');
    if (!camp.author.equals(req.user)) {
        req.flash('error', 'You are not allowed to mess');
        req.redirect(`campgrounds/${camp._id}`)
    }
    else next()
})

const isReviewAuthor = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId).populate('author');
    if (!review.author.equals(req.user)) {
        req.flash('error', 'You are not allowed to mess');
        req.redirect(`campgrounds/${camp._id}`)
    }
    else next()
})

module.exports = { isSignedIn, validateCamp, validateReview, isCampAuthor, isReviewAuthor }