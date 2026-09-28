import { sendError } from "../utils/responseHandler.js";

export const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    return sendError(
        res,
        statusCode,
        err.message || "Internal server error"
    );
};