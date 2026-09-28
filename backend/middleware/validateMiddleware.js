import { sendError } from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true
            }
        );
        if (error) {
            const errors = error.details.map(
                (detail) => ({
                    field: detail.path.join("."),
                    message: detail.message
                })
            );
            return sendError(
                res,
                STATUS_CODES.BAD_REQUEST,
                MESSAGES.VALIDATION_FAILED,
                errors
            );
        }
        req.body = value;
        next();
    };
};