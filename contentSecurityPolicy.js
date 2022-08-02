const scriptSrcUrls = [
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/589ecfcba8.js",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com/mapbox-gl-js/"
]
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/"
]
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://events.mapbox.com/",
    "https://ka-f.fontawesome.com/"
]
const fontSrcUrls = [
    "https://fonts.gstatic.com/",
    "https://ka-f.fontawesome.com/"
]

const directives = {
    defaultSrc: [],
    connectSrc: ["'self'", ...connectSrcUrls],
    scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
    styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
    workerSrc: ["'self'", "blob:"],
    objectSrc: [],
    imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dmoyqi6br/", //MY CLOUDINARY ACCOUNT! 
        "https://images.unsplash.com/",
    ],
    fontSrc: ["'self'", ...fontSrcUrls]
}

module.exports = directives