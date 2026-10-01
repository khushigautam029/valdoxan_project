import Joi from "joi";

const accessCodePattern =
    /^[^\s-]{3,15}-[^\s-]{3,15}-[^\s-]{3,15}$/;

const accessCodeMessage =
    "Access code must have 3 parts separated by hyphens. Each part must be 3-15 characters, with no spaces or hyphens inside the parts.";


export const createAccessCodeValidation = Joi.object({

    code: Joi.string()
        .pattern(accessCodePattern)
        .required()
        .messages({

            "string.base":
                "Access code must be a string",

            "string.empty":
                "Access code is required",

            "string.pattern.base":
                accessCodeMessage,

            "any.required":
                "Access code is required"

        }),

    description: Joi.string()
        .trim()
        .max(150)
        .allow("")
        .optional()
        .messages({

            "string.base":
                "Description must be a string",

            "string.max":
                "Description cannot exceed 150 characters"

        })

}).options({

    allowUnknown: false

});


export const updateAccessCodeValidation = Joi.object({

    code: Joi.string()
        .pattern(accessCodePattern)
        .optional()
        .messages({

            "string.base":
                "Access code must be a string",

            "string.pattern.base":
                accessCodeMessage

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