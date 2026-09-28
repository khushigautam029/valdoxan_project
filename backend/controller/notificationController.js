import {
    createNotification,
    deleteNotification,
    getNotificationById,
    getNotifications,
    sendNotification,
    updateNotification,
    updateNotificationStatus
} from "../service/notificationService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

export const create = asyncHandler(
    async (req, res) => {
        const notification = await createNotification(
            req.body
        );
        return sendSuccess(
            res,
            STATUS_CODES.CREATED,
            MESSAGES.NOTIFICATION_CREATED,
            notification
        );
    }
);

export const getAll = asyncHandler(
    async (req, res) => {
        const notifications = await getNotifications();
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.NOTIFICATIONS_FETCHED,
            notifications
        );
    }
);

export const getById = asyncHandler(
    async (req, res) => {
        const notification = await getNotificationById(
            req.params.id
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.NOTIFICATION_FETCHED,
            notification
        );
    }
);

export const update = asyncHandler(
    async (req, res) => {
        const notification = await updateNotification(
            req.params.id,
            req.body
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.NOTIFICATION_UPDATED,
            notification
        );
    }
);

export const remove = asyncHandler(
    async (req, res) => {
        const notification = await deleteNotification(
            req.params.id
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.NOTIFICATION_CANCELLED,
            notification
        );
    }
);

export const updateStatus = asyncHandler(
    async (req, res) => {
        const notification = await updateNotificationStatus(
            req.params.id,
            req.body.status
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.NOTIFICATION_STATUS_UPDATED,
            notification
        );
    }
);

export const send = asyncHandler(
    async (req, res) => {
        const notification = await sendNotification(
            req.params.id
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.NOTIFICATION_SENT,
            notification
        );
    }
);