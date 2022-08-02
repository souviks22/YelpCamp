const express = require('express');
const campRouter = express.Router();
const reviewRouter = require('./reviewRouter');
const { isSignedIn, validateCamp, isCampAuthor } = require('../middleware');
const camps = require('../controllers/campgrounds');
const { upload } = require('../cloudinary');


campRouter.route('/')
    .get(camps.campHome)
    .post(isSignedIn, upload.array('images'), validateCamp, camps.newCamp)

campRouter.get('/new', isSignedIn, camps.newCampForm)

campRouter.route('/:id')
    .get(camps.showCamp)
    .patch(isSignedIn, isCampAuthor, upload.array('images'), validateCamp, camps.editCamp)
    .delete(isSignedIn, isCampAuthor, camps.deleteCamp)

campRouter.get('/:id/edit', isSignedIn, isCampAuthor, camps.editCampForm)

campRouter.use('/:id', reviewRouter)
module.exports = campRouter