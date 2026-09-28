import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return sendError(
                res,
                STATUS_CODES.UNAUTHORIZED,
                MESSAGES.UNAUTHORIZED
            );
        }
        if (!authHeader.startsWith("Bearer ")) {
            return sendError(
                res,
                STATUS_CODES.UNAUTHORIZED,
                MESSAGES.INVALID_AUTHORIZATION
            );
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return sendError(
                res,
                STATUS_CODES.UNAUTHORIZED,
                MESSAGES.AUTHENTICATION
            );
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return sendError(
            res,
            STATUS_CODES.UNAUTHORIZED,
            MESSAGES.INVALID_EXPIRED_AUTHENTICATION
        );
    }
};