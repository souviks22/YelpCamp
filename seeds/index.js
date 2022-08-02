const mongoose = require('mongoose');
const dbUrl = process.env.ATLAS_DB_URL || 'mongodb://localhost:27017/yelpcamp'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => { console.log('Connected to yelpcamp database') })
    .catch(() => { console.log('Error!') })

const Campground = require('../models/Campground')
// const Review = require('../models/Review')
// const User = require('../models/User')
const cities = require('./cities')
const names = require('./names')

const choice = arr => arr[Math.floor(Math.random() * arr.length)]
const seed = async () => {
    // await Campground.deleteMany();
    // await Review.deleteMany();
    // await User.deleteMany();
    // const user = new User({ email: 'souviksarkar2k3@gmail.com', username: 'Souviks22' });
    // await User.register(user, '6nJxRVCBP!!aYia');

    for (let i = 0; i < 1000; i++) {
        const city = choice(cities);
        const camp = new Campground({
            author: '62e637c822224a534bb7f93a', // user._id,
            cost: 16.99,
            description: "Camp is an aesthetic style and sensibility that regards something as appealing because of its bad taste and ironic value. Camp aesthetics disrupt many of modernism's notions of what art is and what can be classified as high art by inverting aesthetic attributes such as beauty, value, and taste through an invitation of a different kind of apprehension and consumption.(dummy)",
            title: `${choice(names.descriptors)} ${choice(names.places)}`,
            city: city.city,
            state: city.state,
            place: `${city.city}, ${city.state}, USA`,
            geometry: {
                type: 'Point',
                coordinates: [city.longitude, city.latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dmoyqi6br/image/upload/h_300,w_500,c_thumb/v1658788406/YelpCamp/jimmy-conover-J_XuXX9m0KM-unsplash_qzdfp9.jpg',
                    filename: 'YelpCamp/jimmy-conover-J_XuXX9m0KM-unsplash_qzdfp9'
                },
                {
                    url: 'https://res.cloudinary.com/dmoyqi6br/image/upload/h_300,w_500,c_thumb/v1658787959/YelpCamp/WhatsApp_Image_2022-04-29_at_12.28.45_AM_gli15t.jpg',
                    filename: 'YelpCamp/WhatsApp_Image_2022-04-29_at_12.28.45_AM_gli15t'
                }
            ]
        })
        await camp.save()
    }
}

seed().then(() => {
    console.log('Data injected')
    mongoose.connection.close()
})