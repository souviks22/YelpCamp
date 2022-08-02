// finally deploying
// configuring environment variables
(process.env.NODE_ENV !== 'production') && require('dotenv').config();

const express = require('express');
const app = express();

// connecting mongoose to database
const mongoose = require('mongoose');
const dbUrl = process.env.ATLAS_DB_URL || 'mongodb://localhost:27017/yelpcamp';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => { console.log('Connected to yelpcamp database') })
    .catch(() => { console.log('Error!') })

// templating configuration
app.set('view engine', 'ejs')
const path = require('path');
app.set('views', path.join(__dirname, 'views'))
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'assets')))
const methodOverride = require('method-override');
app.use(methodOverride('_method'))
const AppError = require('./errors/AppError');

// mongo security
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize({
    replaceWith: '_'
}))

// common securities
const helmet = require('helmet');
const directives = require('./contentSecurityPolicy');
app.use(helmet({
    contentSecurityPolicy: { directives },
}))

// session
const session = require('express-session');
const secret = process.env.SESSION_SECRET || 'notAGoodSecret'

const MongoStore = require('connect-mongo');    // session storage
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: { secret }
})
store.on('error', err => { console.log(err) })

const sessionConfig = {
    name: '_yelpcamp__user',
    secret, store,
    secure: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}
app.use(session(sessionConfig))

// flash messages
const flash = require('connect-flash');
app.use(flash())

// passport authentication
const User = require('./models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local');
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// local variables in template
app.use((req, res, next) => {
    res.locals = {
        success: req.flash('success'),
        error: req.flash('error'),
        currentUser: req.user
    }
    next()
})

// REST API
const homeRouter = require('./routers/homeRouter')
app.use('/', homeRouter)
const userRouter = require('./routers/userRouter')
app.use('/', userRouter)
const campRouter = require('./routers/campRouter')
app.use('/campgrounds', campRouter)
const mapRouter = require('./routers/mapRouter')
app.use('/locations', mapRouter)

// JSON responses
app.get('/mapbox', (req, res) => {
    res.json({
        mapToken: process.env.MAPBOX_TOKEN,
        position: req.session.position,
        camps: req.session.camps
    })
})

// Wrong endpoints
app.all('*', (req, res) => {
    throw new AppError('Page not found', 404)
})

// error handler
app.use((err, req, res, next) => {
    const { message = 'Something went wrong', status = 500, stack } = err;
    // res.status(status).render('error/error', { message, status, stack, docTitle: 'Error' })
    const page = (status == 404) ? '/' : req.originalUrl;
    req.flash('error', message);
    res.status(status).redirect(page)
})

// server
const port = process.env.PORT || 2000
app.listen(port, () => { console.log('YelpCamp Server turned On!') })