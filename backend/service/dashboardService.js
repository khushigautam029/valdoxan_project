import {
    AccessCode,
    Content,
    Device,
    Notification,
    User
} from "../models/index.js";

import { Op } from "sequelize";

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

        /*
         * Users created during selected date range.
         *
         * Platform cannot be applied because User does
         * not contain a platform field or device relation.
         */
        User.count({
            where: dateFilter
        }),

        /*
         * Access codes created during selected date range.
         *
         * Platform filtering is not applied here because
         * AccessCode itself has no platform field.
         */
        AccessCode.count({
            where: {
                status: "ACTIVE",
                ...dateFilter
            }
        }),

        /*
         * Published content created during selected date range.
         */
        Content.count({
            where: {
                status: "PUBLISHED",
                ...dateFilter
            }
        }),

        /*
         * Draft content created during selected date range.
         */
        Content.count({
            where: {
                status: "DRAFT",
                ...dateFilter
            }
        }),

        /*
         * Notifications created during selected date range.
         */
        Notification.count({
            where: dateFilter
        }),

        /*
         * Devices matching date + platform filters.
         */
        Device.count({
            where: deviceWhere
        }),

        /*
         * iOS devices matching date filter.
         */
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

        /*
         * Android devices matching date filter.
         */
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

        /*
         * Devices that synced during selected date range.
         */
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