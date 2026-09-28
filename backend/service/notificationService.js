import Notification from "../models/notification.js";
import AppError from "../utils/appError.js";
import {
    STATUS_CODES
} from "../utils/setConstants.js";

export const createNotification = async (data) => {
    const {
        title,
        message,
        audience,
        deliveryType,
        scheduledAt,
        status
    } = data;
    if (
        deliveryType === "SCHEDULED" &&
        !scheduledAt
    ) {
        throw new AppError(
            "Scheduled date is required for scheduled notifications",
            STATUS_CODES.BAD_REQUEST
        );
    }
    const finalStatus =
        deliveryType === "SCHEDULED"
            ? "SCHEDULED"
            : status || "DRAFT";
    const notification = await Notification.create({
        title,
        message,
        audience,
        deliveryType,
        scheduledAt:
            deliveryType === "SCHEDULED"
                ? scheduledAt
                : null,
        status: finalStatus
    });
    return notification;
};

export const getNotifications = async () => {
    return Notification.findAll({
        order: [
            ["createdAt", "DESC"]
        ]
    });
};

export const getNotificationById = async (id) => {
    const notification = await Notification.findByPk(id);
    if (!notification) {
        throw new AppError(
            "Notification not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    return notification;
};

export const updateNotification = async (
    id,
    data
) => {
    const notification = await getNotificationById(id);
    if (notification.status === "SENT") {
        throw new AppError(
            "Sent notifications cannot be updated",
            STATUS_CODES.BAD_REQUEST
        );
    }
    if (
        data.deliveryType === "SCHEDULED" &&
        !data.scheduledAt &&
        !notification.scheduledAt
    ) {
        throw new AppError(
            "Scheduled date is required for scheduled notifications",
            STATUS_CODES.BAD_REQUEST
        );
    }
    await notification.update(data);
    return notification;
};


export const deleteNotification = async (id) => {
    const notification =
        await getNotificationById(id);
    if (notification.status === "SENT") {
        throw new AppError(
            "Sent notifications cannot be deleted",
            STATUS_CODES.BAD_REQUEST
        );
    }
    await notification.update({
        status: "CANCELLED"
    });
    return notification;
};

export const updateNotificationStatus = async (
    id,
    status
) => {
    const notification = await getNotificationById(id);
    if (notification.status === "SENT") {
        throw new AppError(
            "Sent notifications cannot change status",
            STATUS_CODES.BAD_REQUEST
        );
    }
    await notification.update({
        status
    });
    return notification;
};

export const sendNotification = async (id) => {
    const notification = getNotificationById(id);
    if (notification.status === "SENT") {
        throw new AppError(
            "Notification has already been sent",
            STATUS_CODES.BAD_REQUEST
        );
    }
    if (notification.status === "CANCELLED") {
        throw new AppError(
            "Cancelled notification cannot be sent",
            STATUS_CODES.BAD_REQUEST
        );
    }
    await notification.update({
        status: "SENT",
        sentAt: new Date()
    });
    return notification;
};