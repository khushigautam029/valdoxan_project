import Joi from "joi";

export const createCategoryValidation = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required()
        .messages({
            "string.base":
                "Category name must be a string",
            "string.empty":
                "Category name is required",
            "string.min":
                "Category name must be at least 2 characters",
            "string.max":
                "Category name cannot exceed 150 characters",
            "any.required":
                "Category name is required"
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
        }),

    sortOrder: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            "number.base":
                "Sort order must be a number",
            "number.integer":
                "Sort order must be an integer",
            "number.min":
                "Sort order cannot be negative"
        })

})
.options({
    allowUnknown: false
});


export const updateCategoryValidation = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .optional()
        .messages({
            "string.base":
                "Category name must be a string",
            "string.min":
                "Category name must be at least 2 characters",
            "string.max":
                "Category name cannot exceed 150 characters"
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
        }),


    sortOrder: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            "number.base":
                "Sort order must be a number",
            "number.integer":
                "Sort order must be an integer",
            "number.min":
                "Sort order cannot be negative"
        })

})
.min(1)
.messages({
    "object.min":
        "At least one field is required for update"
})
.options({
    allowUnknown: false
});