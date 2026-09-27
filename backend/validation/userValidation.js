import Joi from "joi";

export const loginValidation = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required"
        }),

    password: Joi.string()
        .min(8)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "any.required": "Password is required"
        })
});

export const registerValidation = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name cannot exceed 100 characters",
            "any.required": "Name is required"
        }),

    email: Joi.string()
        .trim()
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
        .pattern(/[A-Z]/)
        .pattern(/[a-z]/)
        .pattern(/[0-9]/)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password cannot exceed 100 characters",
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
            "any.required": "Password is required"
        }),

    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Confirm password is required"
        })
});