import {
    createNotification,
    deleteNotification,
    getNotificationById,
    getNotifications,
    sendNotification,
    updateNotification,
    updateNotificationStatus
} from "../service/notificationService.js";

export const create = async (req, res, next) => {
    try {
        const notification = await createNotification(req.body);

        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const notifications = await getNotifications();

        res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
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

        res.status(200).json({
            success: true,
            message: "Notification fetched successfully",
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

        res.status(200).json({
            success: true,
            message: "Notification updated successfully",
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

        res.status(200).json({
            success: true,
            message: "Notification cancelled successfully",
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

        res.status(200).json({
            success: true,
            message: "Notification status updated successfully",
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

        res.status(200).json({
            success: true,
            message: "Notification sent successfully",
            data: notification
        });
    } catch (error) {
        next(error);
    }
};