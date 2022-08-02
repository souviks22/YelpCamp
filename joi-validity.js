const sanitizeHTML = require('sanitize-html')

const extension = Joi => ({
    type: 'string',
    base: Joi.string(),
    messages: {
        'string.xssHandle': '{{#label}} must not contain violating characters'
    },
    rules: {
        xssHandle: {
            validate(value, helpers) {
                const cleaned = sanitizeHTML(value, { allowedTags: [], allowedAttributes: {} })
                if (value !== cleaned)
                    return helpers.error('string.xssHandle', { value });
                return cleaned;
            }
        }
    }
})
const Joi = require('joi').extend(extension)

const campValid = Joi.object({
    title: Joi.string()
        .min(3)
        .required()
        .xssHandle()
    ,
    cost: Joi.number()
        .min(0)
        .required()
    ,
    description: Joi.string()
        .min(10)
        .required()
        .xssHandle()
    ,
    city: Joi.string()
        .min(2)
        .required()
        .xssHandle()
    ,
    state: Joi
        .string()
        .min(2)
        .required()
        .xssHandle()
    ,
    images: Joi.array()
        .items(Joi.object({
            url: Joi.string(),
            filename: Joi.string()
        }))
})

const reviewValid = Joi.object({
    body: Joi
        .string()
        .min(5)
        .required()
    ,
    rating: Joi.number()
        .required()
})

module.exports = { campValid, reviewValid }