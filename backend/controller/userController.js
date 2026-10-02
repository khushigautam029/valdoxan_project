import {
    changePassword,
    deleteAccount,
    forgotPassword,
    getMe,
    loginUser,
    logoutUser,
    resetPassword,
    updateProfile
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
        const result = await logoutUser(req.user.id);

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            result.message
        );
    }
);

export const updateProfileController = asyncHandler(
    async (req, res) => {
        const result = await updateProfile(
            req.user.id,
            req.body.name
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.PROFILE_UPDATED,
            result
        );
    }
);

export const changePasswordController = asyncHandler(
    async (req, res) => {
        const result = await changePassword(
            req.user.id,
            req.body.currentPassword,
            req.body.newPassword
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            result.message
        );
    }
);

export const deleteAccountController = asyncHandler(
    async (req, res) => {
        const result = await deleteAccount(
            req.user.id
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            result.message
        );
    }
);


export const forgotPasswordController = asyncHandler(
    async (req, res) => {

        const result = await forgotPassword(
            req.body.email
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            result.message
        );
    }
);

export const resetPasswordController = asyncHandler(
    async (req, res) => {

        const result = await resetPassword(
            req.body.token,
            req.body.newPassword
        );

        return sendSuccess(
            res,
            STATUS_CODES.OK,
            result.message
        );
    }
);