const mongoose = require('mongoose');
const dbUrl = 'mongodb+srv://Souviks22:wTSmAJAFttHYmwDv@cluster0.enmse.mongodb.net/?retryWrites=true&w=majority' // || 'mongodb://localhost:27017/yelpcamp'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => { console.log('Connected to yelpcamp database') })
    .catch((err) => { console.error('Error!', err) })

const Campground = require('../models/Campground')
// const Review = require('../models/Review')
// const User = require('../models/User')
const places = require('./places')
const titles = require('./titles')
const users = require('./users')
const costs = require('./costs')
const images = require('./images')
const descriptions = require('./descripitons')

const choice = arr => arr[Math.floor(Math.random() * arr.length)]
const seed = async () => {

    // await Campground.deleteMany();
    // await Review.deleteMany();
    // await User.deleteMany();

    // for (const user of users) {
    //     const newUser = new User({ email: user.email, username: user.username });
    //     await User.register(newUser, user.password);
    // }

    for (let i = 0; i < 500; i++) {
        const place = choice(places);
        const camp = new Campground({
            author: choice(users).id,
            cost: choice(costs),
            description: choice(descriptions),
            title: `${choice(titles.descriptors)} ${choice(titles.places)}`,
            city: place.city,
            state: place.state,
            place: `${place.city}, ${place.state}, USA`,
            geometry: {
                type: 'Point',
                coordinates: [place.longitude, place.latitude]
            },
            images: [choice(images), choice(images)]
        })
        await camp.save()
    }
}

seed().then(() => {
    console.log('Data injected')
    mongoose.connection.close()
})