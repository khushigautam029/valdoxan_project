import Notification from "../models/notification.js";

export const createNotification = async (data) => {
    const {
        title,
        message,
        audience,
        deliveryType,
        scheduledAt,
        status
    } = data;

    if (deliveryType === "SCHEDULED" && !scheduledAt) {
        const error = new Error(
            "Scheduled date is required for scheduled notifications"
        );

        error.statusCode = 400;

        throw error;
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
        order: [["createdAt", "DESC"]]
    });
};

export const getNotificationById = async (id) => {
    const notification = await Notification.findByPk(id);

    if (!notification) {
        const error = new Error("Notification not found");
        error.statusCode = 404;
        throw error;
    }

    return notification;
};

export const updateNotification = async (id, data) => {
    const notification = await getNotificationById(id);

    if (notification.status === "SENT") {
        const error = new Error(
            "Sent notifications cannot be updated"
        );

        error.statusCode = 400;

        throw error;
    }

    if (
        data.deliveryType === "SCHEDULED" &&
        !data.scheduledAt &&
        !notification.scheduledAt
    ) {
        const error = new Error(
            "Scheduled date is required for scheduled notifications"
        );

        error.statusCode = 400;

        throw error;
    }

    await notification.update(data);

    return notification;
};

export const deleteNotification = async (id) => {
    const notification = await getNotificationById(id);

    if (notification.status === "SENT") {
        const error = new Error(
            "Sent notifications cannot be deleted"
        );

        error.statusCode = 400;

        throw error;
    }

    await notification.update({
        status: "CANCELLED"
    });

    return notification;
};

export const updateNotificationStatus = async (id, status) => {
    const notification = await getNotificationById(id);

    if (notification.status === "SENT") {
        const error = new Error(
            "Sent notifications cannot change status"
        );

        error.statusCode = 400;

        throw error;
    }

    await notification.update({
        status
    });

    return notification;
};

export const sendNotification = async (id) => {
    const notification = await getNotificationById(id);

    if (notification.status === "SENT") {
        const error = new Error(
            "Notification has already been sent"
        );

        error.statusCode = 400;

        throw error;
    }

    if (notification.status === "CANCELLED") {
        const error = new Error(
            "Cancelled notification cannot be sent"
        );

        error.statusCode = 400;

        throw error;
    }

    /*
     * Actual push notification delivery
     * using FCM/APNs will be integrated later.
     */

    await notification.update({
        status: "SENT",
        sentAt: new Date()
    });

    return notification;
};