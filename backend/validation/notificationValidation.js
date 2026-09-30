import Joi from "joi";


export const createNotificationValidation = Joi.object({

    title: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .required()
        .messages({
            "string.base":
                "Title must be a string",
            "string.empty":
                "Title is required",
            "string.min":
                "Title must be at least 3 characters",
            "string.max":
                "Title cannot exceed 255 characters",
            "any.required":
                "Title is required"
        }),


    message: Joi.string()
        .trim()
        .min(1)
        .required()
        .messages({
            "string.base":
                "Message must be a string",
            "string.empty":
                "Message is required",
            "any.required":
                "Message is required"
        }),


    audience: Joi.string()
        .valid("ALL", "IOS", "ANDROID")
        .required()
        .messages({
            "string.base":
                "Audience must be a string",
            "any.only":
                "Audience must be ALL, IOS or ANDROID",
            "any.required":
                "Audience is required"
        }),


    deliveryType: Joi.string()
        .valid("NOW", "SCHEDULED")
        .required()
        .messages({
            "string.base":
                "Delivery type must be a string",
            "any.only":
                "Delivery type must be NOW or SCHEDULED",
            "any.required":
                "Delivery type is required"
        }),


    scheduledAt: Joi.date()
        .iso()
        .greater("now")
        .allow(null, "")
        .optional()
        .messages({
            "date.base":
                "Scheduled date must be valid",
            "date.format":
                "Scheduled date must be in valid ISO format"
        }),


    status: Joi.string()
        .when("deliveryType", {
            is: "SCHEDULED",
            then: Joi.valid("SCHEDULED").default("SCHEDULED"),
            otherwise: Joi.valid("DRAFT").default("DRAFT")
        })
        .optional()
        .messages({
            "string.base":
                "Status must be a string",
            "any.only":
                "NOW delivery must be DRAFT and SCHEDULED delivery must be SCHEDULED"
        })

})
.custom((value, helpers) => {
    if (value.deliveryType === "SCHEDULED" && !value.scheduledAt) {
        return helpers.error("any.custom", {
            message: "A future scheduled date is required for scheduled notifications"
        });
    }
    if (value.deliveryType === "NOW" && value.scheduledAt) {
        return helpers.error("any.custom", {
            message: "scheduledAt must be empty for immediate notifications"
        });
    }
    return value;
})
.messages({ "any.custom": "{{#message}}" })
.options({
    allowUnknown: false
});


export const updateNotificationValidation = Joi.object({

    title: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .optional()
        .messages({
            "string.base":
                "Title must be a string",
            "string.empty":
                "Title cannot be empty",
            "string.min":
                "Title must be at least 3 characters",
            "string.max":
                "Title cannot exceed 255 characters"
        }),


    message: Joi.string()
        .trim()
        .min(1)
        .optional()
        .messages({
            "string.base":
                "Message must be a string",
            "string.empty":
                "Message cannot be empty"
        }),


    audience: Joi.string()
        .valid("ALL", "IOS", "ANDROID")
        .optional()
        .messages({
            "string.base":
                "Audience must be a string",
            "any.only":
                "Audience must be ALL, IOS or ANDROID"
        }),


    deliveryType: Joi.string()
        .valid("NOW", "SCHEDULED")
        .optional()
        .messages({
            "string.base":
                "Delivery type must be a string",
            "any.only":
                "Delivery type must be NOW or SCHEDULED"
        }),


    scheduledAt: Joi.date()
        .iso()
        .greater("now")
        .allow(null, "")
        .optional()
        .messages({
            "date.base":
                "Scheduled date must be valid",
            "date.format":
                "Scheduled date must be in valid ISO format"
        }),


    status: Joi.string()
        .valid(
            "DRAFT",
            "SCHEDULED",
            "CANCELLED"
        )
        .optional()
        .messages({
            "string.base":
                "Status must be a string",
            "any.only":
                "Status must be DRAFT, SCHEDULED or CANCELLED"
        })

})
.min(1)
.custom((value, helpers) => {
    if (value.status === "SCHEDULED" && value.deliveryType === "NOW") {
        return helpers.error("any.custom", {
            message: "A SCHEDULED notification must use SCHEDULED delivery"
        });
    }
    if (value.deliveryType === "NOW" && value.scheduledAt) {
        return helpers.error("any.custom", {
            message: "scheduledAt must be empty for immediate notifications"
        });
    }
    return value;
})
.messages({
    "object.min": "At least one field is required for update",
    "any.custom": "{{#message}}"
})
.options({
    allowUnknown: false
});


export const notificationStatusValidation = Joi.object({

    status: Joi.string()
        .valid(
            "DRAFT",
            "SCHEDULED",
            "CANCELLED"
        )
        .required()
        .messages({
            "string.base":
                "Status must be a string",
            "any.only":
                "Status must be DRAFT, SCHEDULED or CANCELLED",
            "any.required":
                "Status is required"
        })

})
.options({
    allowUnknown: false
});
