import Notification from "../models/notification.js";
import AppError from "../utils/appError.js";
import {
    STATUS_CODES
} from "../utils/setConstants.js";

const validateDeliveryState = ({
    deliveryType,
    scheduledAt,
    status
}) => {
    if (status === "CANCELLED") {
        return;
    }

    if (deliveryType === "SCHEDULED") {
        if (status !== "SCHEDULED") {
            throw new AppError(
                "Scheduled delivery must have SCHEDULED status",
                STATUS_CODES.BAD_REQUEST
            );
        }
        if (
            !scheduledAt ||
            new Date(scheduledAt) <= new Date()
        ) {
            throw new AppError(
                "A future scheduled date is required for scheduled notifications",
                STATUS_CODES.BAD_REQUEST
            );
        }
        return;
    }

    if (deliveryType === "NOW" && status !== "DRAFT") {
        throw new AppError(
            "Immediate delivery must have DRAFT status",
            STATUS_CODES.BAD_REQUEST
        );
    }
};

export const createNotification = async (data) => {
    const {
        title,
        message,
        audience,
        deliveryType,
        scheduledAt,
        status
    } = data;
    const finalStatus =
        deliveryType === "SCHEDULED"
            ? "SCHEDULED"
            : status || "DRAFT";
    validateDeliveryState({
        deliveryType,
        scheduledAt,
        status: finalStatus
    });
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
    const updatedState = {
        deliveryType: data.deliveryType ?? notification.deliveryType,
        scheduledAt: Object.hasOwn(data, "scheduledAt")
            ? data.scheduledAt || null
            : notification.scheduledAt,
        status: data.status ?? notification.status
    };
    if (updatedState.deliveryType === "NOW") {
        updatedState.scheduledAt = null;
        if (
            data.deliveryType === "NOW" &&
            data.status === undefined &&
            updatedState.status === "SCHEDULED"
        ) {
            updatedState.status = "DRAFT";
        }
    }
    validateDeliveryState(updatedState);
    await notification.update({
        ...data,
        scheduledAt: updatedState.scheduledAt,
        status: updatedState.status
    });
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
    validateDeliveryState({
        deliveryType: notification.deliveryType,
        scheduledAt: notification.scheduledAt,
        status
    });
    await notification.update({
        status
    });
    return notification;
};

export const sendNotification = async (id) => {
    const notification = await getNotificationById(id);

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
