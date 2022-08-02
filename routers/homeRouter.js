const express = require('express');
const homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    res.render('home/home', { docTitle: 'Home' })
})

module.exports = homeRouter