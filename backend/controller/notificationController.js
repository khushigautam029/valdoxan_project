import {
    createNotification,
    deleteNotification,
    getNotificationById,
    getNotifications,
    sendNotification,
    updateNotification,
    updateNotificationStatus
} from "../service/notificationService.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

export const create = async (req, res, next) => {
    try {
        const notification = await createNotification(req.body);
        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.NOTIFICATION_CREATED,
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const notifications = await getNotifications();
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.NOTIFICATIONS_FETCHED,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const notification = await getNotificationById(
            req.params.id
        );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.NOTIFICATION_FETCHED,
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const notification = await updateNotification(
            req.params.id,
            req.body
        );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.NOTIFICATION_UPDATED,
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const notification = await deleteNotification(
            req.params.id
        );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.NOTIFICATION_CANCELLED,
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const notification = await updateNotificationStatus(
            req.params.id,
            req.body.status
        );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.NOTIFICATION_STATUS_UPDATED,
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

export const send = async (req, res, next) => {
    try {
        const notification = await sendNotification(
            req.params.id
        );
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.NOTIFICATION_SENT,
            data: notification
        });
    } catch (error) {
        next(error);
    }
};