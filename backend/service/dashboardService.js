import { Op } from "sequelize";
import {
    AccessCode,
    Content,
    Device,
    Notification,
    User
} from "../models/index.js";

export const getDashboardStats = async ({
    from,
    to,
    platform
}) => {
    const dateFilter = {};

    if (from && to) {
        dateFilter.createdAt = {
            [Op.gte]: new Date(`${from}T00:00:00`),
            [Op.lte]: new Date(`${to}T23:59:59.999`)
        };
    }

    const deviceWhere = {};

    if (from && to) {
        deviceWhere.createdAt = {
            [Op.gte]: new Date(`${from}T00:00:00`),
            [Op.lte]: new Date(`${to}T23:59:59.999`)
        };
    }

    if (platform && platform !== "ALL") {
        deviceWhere.platform = platform;
    }

    const [
        totalUsers,
        activeAccessCodes,
        publishedContent,
        draftContent,
        totalNotifications,
        totalDevices,
        iosDevices,
        androidDevices,
        syncedDevices
    ] = await Promise.all([
        User.count({
            where: dateFilter
        }),
        AccessCode.count({
            where: {
                status: "ACTIVE",
                ...dateFilter
            }
        }),

        Content.count({
            where: {
                status: "PUBLISHED",
                ...dateFilter
            }
        }),

        Content.count({
            where: {
                status: "DRAFT",
                ...dateFilter
            }
        }),

        Notification.count({
            where: dateFilter
        }),

        Device.count({
            where: deviceWhere
        }),

        Device.count({
            where: {
                ...(
                    from && to
                        ? {
                            createdAt: {
                                [Op.gte]: new Date(
                                    `${from}T00:00:00`
                                ),
                                [Op.lte]: new Date(
                                    `${to}T23:59:59.999`
                                )
                            }
                        }
                        : {}
                ),
                platform: "IOS"
            }
        }),

        Device.count({
            where: {
                ...(
                    from && to
                        ? {
                            createdAt: {
                                [Op.gte]: new Date(
                                    `${from}T00:00:00`
                                ),
                                [Op.lte]: new Date(
                                    `${to}T23:59:59.999`
                                )
                            }
                        }
                        : {}
                ),
                platform: "ANDROID"
            }
        }),

        Device.count({
            where: {
                ...deviceWhere,
                lastSync: {
                    [Op.ne]: null,
                    ...(from && to
                        ? {
                            [Op.between]: [
                                new Date(
                                    `${from}T00:00:00`
                                ),
                                new Date(
                                    `${to}T23:59:59.999`
                                )
                            ]
                        }
                        : {})
                }
            }
        })
    ]);

    return {
        totalUsers,
        activeAccessCodes,
        publishedContent,
        draftContent,
        totalNotifications,

        totalDevices,
        iosDevices,
        androidDevices,
        syncedDevices,

        filters: {
            from: from || null,
            to: to || null,
            platform: platform || "ALL"
        }
    };
};