import Joi from "joi";


export const createContentValidation = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .required()
        .messages({
            "string.empty": "Title is required",
            "string.min": "Title must be at least 3 characters",
            "string.max": "Title cannot exceed 255 characters",
            "any.required": "Title is required"
        }),

    categoryId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Category ID must be a number",
            "number.integer": "Category ID must be an integer",
            "number.positive": "Category ID must be a positive number",
            "any.required": "Category is required"
        }),

    sortOrder: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.base": "Sort order must be a number",
            "number.integer": "Sort order must be an integer",
            "number.min": "Sort order cannot be negative",
            "any.required": "Sort order is required"
        }),

    status: Joi.string()
        .valid("draft", "published")
        .required()
        .messages({
            "any.only": "Status must be draft or published",
            "any.required": "Status is required"
        }),

    body: Joi.string()
        .trim()
        .min(1)
        .required()
        .messages({
            "string.empty": "Content body is required",
            "any.required": "Content body is required"
        }),

    imageUrl: Joi.string()
        .trim()
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.max": "Image URL cannot exceed 500 characters"
        }),

    externalLink: Joi.string()
        .trim()
        .uri({
            scheme: ["http", "https"]
        })
        .max(1000)
        .allow("", null)
        .optional()
        .messages({
            "string.uri": "External link must be a valid HTTP or HTTPS URL",
            "string.max": "External link cannot exceed 1000 characters"
        })
});


export const updateContentValidation = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .optional()
        .messages({
            "string.min": "Title must be at least 3 characters",
            "string.max": "Title cannot exceed 255 characters"
        }),

    categoryId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "Category ID must be a number",
            "number.integer": "Category ID must be an integer",
            "number.positive": "Category ID must be a positive number"
        }),

    sortOrder: Joi.number()
        .integer()
        .min(0)
        .optional()
        .messages({
            "number.base": "Sort order must be a number",
            "number.integer": "Sort order must be an integer",
            "number.min": "Sort order cannot be negative"
        }),

    status: Joi.string()
        .valid("draft", "published")
        .optional()
        .messages({
            "any.only": "Status must be draft or published"
        }),

    body: Joi.string()
        .trim()
        .min(1)
        .optional()
        .messages({
            "string.empty": "Content body cannot be empty"
        }),

    imageUrl: Joi.string()
        .trim()
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.max": "Image URL cannot exceed 500 characters"
        }),

    externalLink: Joi.string()
        .trim()
        .uri({
            scheme: ["http", "https"]
        })
        .max(1000)
        .allow("", null)
        .optional()
        .messages({
            "string.uri": "External link must be a valid HTTP or HTTPS URL",
            "string.max": "External link cannot exceed 1000 characters"
        })
})
    .min(1)
    .messages({
        "object.min": "At least one field is required for update"
    });


export const contentStatusValidation = Joi.object({
    status: Joi.string()
        .valid("published", "unpublished")
        .required()
        .messages({
            "any.only": "Status must be published or unpublished",
            "any.required": "Status is required"
        })
});


export const reorderContentValidation = Joi.array()
    .items(
        Joi.object({
            id: Joi.number()
                .integer()
                .positive()
                .required()
                .messages({
                    "number.base": "Content ID must be a number",
                    "number.integer": "Content ID must be an integer",
                    "number.positive": "Content ID must be positive",
                    "any.required": "Content ID is required"
                }),

            sortOrder: Joi.number()
                .integer()
                .min(0)
                .required()
                .messages({
                    "number.base": "Sort order must be a number",
                    "number.integer": "Sort order must be an integer",
                    "number.min": "Sort order cannot be negative",
                    "any.required": "Sort order is required"
                })
        })
    )
    .min(1)
    .required()
    .messages({
        "array.min": "At least one content item is required"
    });