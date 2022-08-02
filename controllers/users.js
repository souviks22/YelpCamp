const User = require('../models/User');

const signupForm = (req, res) => {
    res.render('authentication/signUp', { docTitle: 'Sign Up' })
}

const signup = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);
        req.login(regUser, () => {
            req.flash('success', 'Successfully Signed Up');
            res.redirect('/')
        })
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/signup')
    }
}

const signinForm = (req, res) => {
    res.render('authentication/signIn', { docTitle: 'Sign In' })
}

const signin = (req, res) => {
    const returnTo = req.session.returnUrl || '/campgrounds';
    delete req.session.returnUrl;
    req.flash('success', 'Successfully Signed In');
    res.redirect(returnTo)
}

const signout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Signed Out');
    res.redirect('/')
}

module.exports = { signupForm, signup, signinForm, signin, signout }