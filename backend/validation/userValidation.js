import Joi from "joi";

export const loginValidation = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(150)
        .required()
        .messages({
            "string.base": "Email must be a string",
            "string.empty":"Email is required",
            "string.email":"Please enter a valid email address",
            "string.max": "Email cannot exceed 150 characters",
            "any.required":"Email is required"
        }),

    password: Joi.string()
        .min(8)
        .max(100)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
        .required()
        .messages({
            "string.base":"Password must be a string",
            "string.empty":"Password is required",
            "string.min":"Password must be at least 8 characters",
            "string.max":"Password cannot exceed 100 characters",
            "string.pattern.base":"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
            "any.required":"Password is required"
        })

})
.options({
    allowUnknown: false
});

export const updateProfileValidation = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.base": "Name must be a string",
            "string.empty": "Name is required",
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name cannot exceed 100 characters",
            "any.required": "Name is required"
        })

}).options({

    allowUnknown: false

});


export const changePasswordValidation = Joi.object({

    currentPassword: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            "string.base": "Current password must be a string",
            "string.empty": "Current password is required",
            "string.max": "Current password cannot exceed 100 characters",
            "any.required": "Current password is required"
        }),

    newPassword: Joi.string()
        .min(8)
        .max(100)
        .pattern(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
        )
        .required()
        .messages({
            "string.base": "New password must be a string",
            "string.empty": "New password is required",
            "string.min": "New password must be at least 8 characters",
            "string.max": "New password cannot exceed 100 characters",
            "string.pattern.base":
                "New password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
            "any.required": "New password is required"
        }),

    confirmPassword: Joi.any()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "Confirm password must match new password",
            "any.required": "Confirm password is required"
        })

}).options({

    allowUnknown: false

});
