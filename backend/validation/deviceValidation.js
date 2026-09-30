
import Joi from "joi";

export const registerDeviceSchema = Joi.object({
    deviceId: Joi.string()
        .trim()
        .max(255)
        .required()
        .messages({
            "string.empty": "Device ID is required",
            "any.required": "Device ID is required"
        }),

    platform: Joi.string()
        .valid("IOS", "ANDROID")
        .required()
        .messages({
            "any.only": "Platform must be IOS or ANDROID",
            "any.required": "Platform is required"
        }),

    osVersion: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            "string.empty": "OS version is required",
            "any.required": "OS version is required"
        }),

    accessCode: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Access code is required",
            "any.required": "Access code is required"
        })
});
