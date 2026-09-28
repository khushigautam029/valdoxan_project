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
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
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


export const verifyOtpValidation = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(150)
        .required()
        .messages({
            "string.base":"Email must be a string",
            "string.empty":"Email is required",
            "string.email":"Please enter a valid email address",
            "string.max":"Email cannot exceed 150 characters",
            "any.required": "Email is required"
        }),
    otp: Joi.string()
        .pattern(/^[0-9]{6}$/)
        .required()
        .messages({
            "string.base":"OTP must be a string",
            "string.empty":"OTP is required",
            "string.pattern.base":"OTP must be exactly 6 digits",
            "any.required":"OTP is required"
        })
})
.options({
    allowUnknown: false
});