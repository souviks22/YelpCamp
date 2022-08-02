const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./Review');
const { cloudinary } = require('../cloudinary')

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('tiny').get(function () {
    return this.url.replace('/upload', '/upload/h_60,w_100,c_thumb')
})
imageSchema.virtual('slide').get(function () {
    return this.url.replace('/upload', '/upload/h_300,w_500,c_thumb')
})

const opts = { toJSON: { virtuals: true } }

const campSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    cost: Number,
    description: String,
    city: String,
    state: String,
    place: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: [Number]
    },
    images: [imageSchema],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

campSchema.virtual('properties.popupText').get(function () {
    return (
        `<a href='/campgrounds/${this._id}' class='popup'>
            <h4>${this.title}</h4>
            <p>${this.place}</p>
            <img class='img-fluid' src='${this.images[0].url}'>
        </a>`
    )
})

campSchema.post('findOneAndDelete', async camp => {
    if (camp) {
        await Review.deleteMany({ _id: { $in: camp.reviews } });
        for (let img of camp.images)
            await cloudinary.uploader.destroy(img.filename);
    }
})

const Campground = mongoose.model('Campground', campSchema);
module.exports = Campground