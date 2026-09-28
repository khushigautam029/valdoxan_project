import Joi from "joi";

export const createAccessCodeValidation = Joi.object({
    code: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.base": "Access code must be a string",
            "string.empty": "Access code is required",
            "string.min":
                "Access code must be at least 3 characters",
            "string.max":
                "Access code cannot exceed 50 characters",
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
        .min(3)
        .max(50)
        .optional()
        .messages({
            "string.base":
                "Access code must be a string",
            "string.min":
                "Access code must be at least 3 characters",
            "string.max":
                "Access code cannot exceed 50 characters"
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