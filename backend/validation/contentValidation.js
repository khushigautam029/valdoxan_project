import Joi from "joi";

const titlePattern =
    /^(?! )[^\s]+(?: [^\s]+)*(?<! )$/;

export const createContentValidation = Joi.object({

    title: Joi.string()
        .min(3)
        .max(150)
        .pattern(titlePattern)
        .required()
        .messages({
            "string.base":
                "Title must be a string",

            "string.empty":
                "Title is required",

            "string.min":
                "Title must be at least 3 characters",

            "string.max":
                "Title cannot exceed 150 characters",

            "string.pattern.base":
                "Title cannot have spaces at the beginning or end, and only one space is allowed between words",

            "any.required":
                "Title is required"
        }),

    categoryId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base":
                "Category ID must be a number",

            "number.integer":
                "Category ID must be an integer",

            "number.positive":
                "Category ID must be a positive number",

            "any.required":
                "Category is required"
        }),

    sortOrder: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.base":
                "Sort order must be a number",

            "number.integer":
                "Sort order must be an integer",

            "number.min":
                "Sort order cannot be negative",

            "any.required":
                "Sort order is required"
        }),

    status: Joi.string()
        .valid("draft", "published")
        .required()
        .messages({
            "string.base":
                "Status must be a string",

            "any.only":
                "Status must be draft or published",

            "any.required":
                "Status is required"
        }),

    body: Joi.string()
        .trim()
        .min(1)
        .required()
        .messages({
            "string.base":
                "Content body must be a string",

            "string.empty":
                "Content body is required",

            "any.required":
                "Content body is required"
        }),

    imageUrl: Joi.string()
        .trim()
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.base":
                "Image URL must be a string",

            "string.max":
                "Image URL cannot exceed 500 characters"
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
            "string.base":
                "External link must be a string",

            "string.uri":
                "External link must be a valid HTTP or HTTPS URL",

            "string.max":
                "External link cannot exceed 1000 characters"
        })

}).options({
    allowUnknown: false
});


export const updateContentValidation = Joi.object({

    title: Joi.string()
        .min(3)
        .max(150)
        .pattern(titlePattern)
        .optional()
        .messages({
            "string.base":
                "Title must be a string",

            "string.empty":
                "Title cannot be empty",

            "string.min":
                "Title must be at least 3 characters",

            "string.max":
                "Title cannot exceed 150 characters",

            "string.pattern.base":
                "Title cannot have spaces at the beginning or end, and only one space is allowed between words"
        }),

    categoryId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base":
                "Category ID must be a number",

            "number.integer":
                "Category ID must be an integer",

            "number.positive":
                "Category ID must be a positive number"
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
        }),

    status: Joi.string()
        .valid("draft", "published")
        .optional()
        .messages({
            "string.base":
                "Status must be a string",

            "any.only":
                "Status must be draft or published"
        }),

    body: Joi.string()
        .trim()
        .min(1)
        .optional()
        .messages({
            "string.base":
                "Content body must be a string",

            "string.empty":
                "Content body cannot be empty"
        }),

    imageUrl: Joi.string()
        .trim()
        .max(500)
        .allow("", null)
        .optional()
        .messages({
            "string.base":
                "Image URL must be a string",

            "string.max":
                "Image URL cannot exceed 500 characters"
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
            "string.base":
                "External link must be a string",

            "string.uri":
                "External link must be a valid HTTP or HTTPS URL",

            "string.max":
                "External link cannot exceed 1000 characters"
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


export const contentStatusValidation = Joi.object({

    status: Joi.string()
        .valid("published", "draft")
        .required()
        .messages({
            "string.base":
                "Status must be a string",

            "any.only":
                "Status must be published or draft",

            "any.required":
                "Status is required"
        })

}).options({
    allowUnknown: false
});

export const reorderContentValidation = Joi.array()
    .items(
        Joi.object({

            id: Joi.number()
                .integer()
                .positive()
                .required()
                .messages({
                    "number.base":
                        "Content ID must be a number",

                    "number.integer":
                        "Content ID must be an integer",

                    "number.positive":
                        "Content ID must be positive",

                    "any.required":
                        "Content ID is required"
                }),

            sortOrder: Joi.number()
                .integer()
                .min(0)
                .required()
                .messages({
                    "number.base":
                        "Sort order must be a number",

                    "number.integer":
                        "Sort order must be an integer",

                    "number.min":
                        "Sort order cannot be negative",

                    "any.required":
                        "Sort order is required"
                })

        }).options({
            allowUnknown: false
        })
    )
    .min(1)
    .required()
    .messages({
        "array.base":
            "Content reorder data must be an array",

        "array.min":
            "At least one content item is required",

        "any.required":
            "Content reorder data is required"
    });