import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.PNG_IMAGE_FILE
            });
        }
        const imageUrl =
            `/uploads/content/${req.file.filename}`;
        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            message:MESSAGES.IMAGE_UPLOADED,
            data: {
                imageUrl
            }
        });
    } catch (error) {
        next(error);
    }
};