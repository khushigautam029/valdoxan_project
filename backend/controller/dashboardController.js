import {
    getDashboardStats
} from "../service/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    sendSuccess
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

export const getStats = asyncHandler(
    async (req, res) => {
        const stats =
            await getDashboardStats();
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.DASHBOARD_STATS_FETCHED,
            {
                stats
            }
        );
    }
);