import {
    AccessCode,
    Content,
    Notification,
    User
} from "../models/index.js";

export const getDashboardStats = async () => {
    const [
        totalUsers,
        activeAccessCodes,
        publishedContent,
        draftContent,
        totalNotifications
    ] = await Promise.all([
        User.count(),
        AccessCode.count({
            where: {
                status: "ACTIVE"
            }
        }),
        Content.count({
            where: {
                status: "PUBLISHED"
            }
        }),
        Content.count({
            where: {
                status: "DRAFT"
            }
        }),
        Notification.count()
    ]);
    return {
        totalUsers,
        activeAccessCodes,
        publishedContent,
        draftContent,
        totalNotifications
    };
};