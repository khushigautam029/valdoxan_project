import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/index.js";
import { sendError } from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

export const authenticate = async (req, res, next) => {
    let decoded;
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
        decoded = verifyToken(token);
    } catch {
        return sendError(
            res,
            STATUS_CODES.UNAUTHORIZED,
            MESSAGES.INVALID_EXPIRED_AUTHENTICATION
        );
    }

    try {
        const user = await User.findByPk(decoded.id, {
            attributes: ["id", "status", "tokenVersion"]
        });
        if (!user || user.status !== "ACTIVE" || decoded.tokenVersion !== user.tokenVersion) {
            return sendError(
                res,
                STATUS_CODES.UNAUTHORIZED,
                MESSAGES.INVALID_EXPIRED_AUTHENTICATION
            );
        }
        req.user = decoded;
    } catch (error) {
        return next(error);
    }
    return next();
};
