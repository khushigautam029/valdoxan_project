import {
    getMe,
    loginUser,
    logoutUser,
    verifyLoginOtp
} from "../service/userService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

export const login = asyncHandler(
    async (req, res) => {
        const result = await loginUser(
            req.body.email,
            req.body.password
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.OTP_SENT,
            result
        );
    }
);

export const verifyOtp = asyncHandler(
    async (req, res) => {
        const result = await verifyLoginOtp(
            req.body.email,
            req.body.otp
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.LOGIN_SUCCESSFUL,
            result
        );
    }
);

export const getMeController = asyncHandler(
    async (req, res) => {
        const user = await getMe(
            req.user.id
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.PROFILE_FETCHED,
            user
        );
    }
);

export const logout = asyncHandler(
    async (req, res) => {
        const result = await logoutUser();
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            result.message
        );
    }
);