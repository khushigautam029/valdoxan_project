import { sendError } from "../utils/responseHandler.js";
import { STATUS_CODES } from "../utils/setConstants.js";

export const errorMiddleware = (err, req, res, next) => {
    const isUniqueConflict = err.name === "SequelizeUniqueConstraintError";
    const isDatabaseConflict = isUniqueConflict || err.name === "SequelizeForeignKeyConstraintError";
    let statusCode = err.statusCode || 500;
    if (isDatabaseConflict) {
        statusCode = STATUS_CODES.CONFLICT;
    } else if (err.name === "SequelizeValidationError") {
        statusCode = STATUS_CODES.BAD_REQUEST;
    } else if (err.code === "LIMIT_FILE_SIZE") {
        statusCode = STATUS_CODES.PAYLOAD_TOO_LARGE;
    }
    const message = statusCode >= 500
        ? "Internal server error"
        : isDatabaseConflict
            ? "The requested change conflicts with existing data"
            : err.message || "Request failed";

    if (statusCode >= 500) {
        console.error(err);
    }

    return sendError(
        res,
        statusCode,
        message
    );
};
