const express = require('express');
const mapRouter = express.Router();
const Campground = require('../models/Campground');
const catchAsync = require('../errors/catchAsync');

mapRouter.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find();
    req.session.camps = { features: camps }
    res.render('map/map', { docTitle: 'Locations' })
}))

module.exports = mapRouter
