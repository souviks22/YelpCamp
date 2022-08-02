const Campground = require('../models/Campground');
const catchAsync = require('../errors/catchAsync');
const { cloudinary } = require('../cloudinary');
const geocoder = require('../geocoder');

const campHome = catchAsync(async (req, res, next) => {
    let camps = await Campground.find();
    const { search } = req.query;
    if (search)
        camps = camps.filter(camp =>
            camp.title.toLowerCase().includes(search.trim().toLowerCase()) ||
            camp.place.toLowerCase().includes(search.trim().toLowerCase()) ||
            camp.description.toLowerCase().includes(search.trim().toLowerCase())
        );
    res.render('campgrounds/home', { camps, docTitle: 'Campgrounds', search })
})

const newCampForm = (req, res) => {
    res.render('campgrounds/new', { docTitle: 'New Campgrounds' })
}

const showCamp = catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id).populate(['author', { path: 'reviews', populate: 'author' }]);  //note 
    req.session.position = camp.geometry.coordinates;
    res.render('campgrounds/show', { camp, docTitle: `${camp.title}` })
})

const newCamp = catchAsync(async (req, res, next) => {
    const { city, state } = req.body.campground;
    const geodata = await geocoder.forwardGeocode({
        query: `${city}, ${state}`,
        limit: 1
    }).send()
    const [location] = geodata.body.features;
    const images = req.files.map(img => ({ url: img.path, filename: img.filename }));
    const camp = new Campground({
        ...req.body.campground,
        author: req.user._id,
        place: location.place_name,
        geometry: location.geometry,
        images
    });
    await camp.save();
    req.flash('success', `Successfully created ${camp.title}`);
    res.redirect(`/campgrounds/${camp._id}`)
})

const editCampForm = catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id,);
    res.render('campgrounds/edit', { camp, docTitle: `Edit ${camp.title}` })
})

const editCamp = catchAsync(async (req, res, next) => {
    const { campground, deleteImages } = req.body;
    const camp = await Campground.findByIdAndUpdate(req.params.id, campground);
    if (req.files.length) {
        const images = req.files.map(img => ({ url: img.path, filename: img.filename }));
        camp.images.push(...images);
    }
    if (deleteImages) {
        await camp.updateOne({ $pull: { images: { filename: { $in: deleteImages } } } });
        for (let filename of deleteImages)
            await cloudinary.uploader.destroy(filename);
    }
    if (!(camp.city === campground.city && camp.city === campground.city)) {
        const geodata = await geocoder.forwardGeocode({
            query: `${campground.city}, ${campground.state}`,
            limit: 1
        }).send()
        const [location] = geodata.body.features;
        camp.place = location.place_name
        camp.geometry = location.geometry
    }
    await camp.save()
    res.redirect(`/campgrounds/${camp._id}`)
})

const deleteCamp = catchAsync(async (req, res, next) => {
    const camp = await Campground.findByIdAndDelete(req.params.id);
    req.flash('error', `Successfully deleted ${camp.title} Campground`);
    res.redirect('/campgrounds')
})

module.exports = { campHome, newCampForm, showCamp, newCamp, editCampForm, editCamp, deleteCamp }