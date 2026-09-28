import rateLimit from "express-rate-limit";
import {
    MESSAGES,
    STATUS_CODES
} from "./setConstants.js";

const createRateLimitHandler = (message) => {
    return (req, res) => {
        return res.status(
            STATUS_CODES.TOO_MANY_REQUESTS
        ).json({
            success: false,
            statusCode:STATUS_CODES.TOO_MANY_REQUESTS,
            message
        });
    };
};

// General API limiter
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: createRateLimitHandler(MESSAGES.TOO_MANY_REQUEST)
});

// Login limiter
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: createRateLimitHandler(
        MESSAGES.TOO_MANY_LOGIN_ATTEMPT
    )
});

// OTP limiter
export const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    handler: createRateLimitHandler(
        MESSAGES.TOO_MANY_OTP_REQUESTS
    )
});