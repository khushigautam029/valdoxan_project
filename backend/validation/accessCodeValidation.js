import Joi from "joi";

export const createAccessCodeValidation = Joi.object({
    code: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Access code is required",
            "string.min": "Access code must be at least 3 characters",
            "string.max": "Access code cannot exceed 100 characters",
            "any.required": "Access code is required"
        }),

    description: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.max": "Label cannot exceed 255 characters"
        })
});

export const updateAccessCodeValidation = Joi.object({
    code: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .optional()
        .messages({
            "string.min": "Access code must be at least 3 characters",
            "string.max": "Access code cannot exceed 100 characters"
        }),

    description: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.max": "Label cannot exceed 255 characters"
        }),

    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .optional()
        .messages({
            "any.only": "Status must be ACTIVE or INACTIVE"
        })
}).min(1);