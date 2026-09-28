import asyncHandler from "../utils/asyncHandler.js";
import {
    sendError,
    sendSuccess
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

export const uploadImage = asyncHandler(
    async (req, res) => {
        if (!req.file) {
            return sendError(
                res,
                STATUS_CODES.BAD_REQUEST,
                MESSAGES.PNG_IMAGE_FILE
            );
        }
        const imageUrl =
            `/uploads/content/${req.file.filename}`;
        return sendSuccess(
            res,
            STATUS_CODES.CREATED,
            MESSAGES.IMAGE_UPLOADED,
            {
                imageUrl
            }
        );
    }
);