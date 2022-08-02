const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const users = require('../controllers/users');


userRouter.route('/signup')
    .get(users.signupForm)
    .post(users.signup)

const auth = passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/signin'
})
userRouter.route('/signin')
    .get(users.signinForm)
    .post(auth, users.signin)

userRouter.get('/signout', users.signout)

module.exports = userRouter
