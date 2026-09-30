import Joi from "joi";

const accessCodePattern = /^[A-Z0-9]{3,20}-\d{4}-[A-Z0-9]{3,20}$/i;

export const createAccessCodeValidation = Joi.object({
    code: Joi.string()
        .trim()
        .pattern(accessCodePattern)
        .required()
        .messages({
            "string.base":
                "Access code must be a string",

            "string.empty":
                "Access code is required",

            "string.pattern.base":
                "Access code must contain no spaces and follow: 3-20 letters/numbers-4 digit year-3-20 letters/numbers.",
            "any.required":
                "Access code is required"
        }),

    description: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.base":
                "Description must be a string",

            "string.max":
                "Description cannot exceed 255 characters"
        })
}).options({
    allowUnknown: false
});


export const updateAccessCodeValidation = Joi.object({
    code: Joi.string()
        .trim()
        .pattern(accessCodePattern)
        .optional()
        .messages({
            "string.base":
                "Access code must be a string",

            "string.pattern.base":
                "Access code must contain no spaces and follow: 3-20 letters/numbers-4 digit year-3-20 letters/numbers."
        }),

    description: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.base":
                "Description must be a string",

            "string.max":
                "Description cannot exceed 255 characters"
        }),

    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .optional()
        .messages({
            "string.base":
                "Status must be a string",

            "any.only":
                "Status must be ACTIVE or INACTIVE"
        })
})
    .min(1)
    .options({
        allowUnknown: false
    });