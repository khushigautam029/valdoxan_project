import Joi from "joi";

export const loginValidation = Joi.object({

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(150)
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please enter a valid email address",
            "string.max": "Email cannot exceed 150 characters",
            "any.required": "Email is required"
        }),

    password: Joi.string()
        .min(8)
        .max(100)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password cannot exceed 100 characters",
            "any.required": "Password is required"
        })
});


export const verifyOtpValidation = Joi.object({

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(150)
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required"
        }),

    otp: Joi.string()
        .pattern(/^[0-9]{6}$/)
        .required()
        .messages({
            "string.empty": "OTP is required",
            "string.pattern.base": "OTP must be exactly 6 digits",
            "any.required": "OTP is required"
        })
});