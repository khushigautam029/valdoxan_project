import {
    getDeviceById,
    getDevicesByAccessCode,
    getDeviceStats
} from "../service/deviceService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    sendSuccess
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

export const getByAccessCode = asyncHandler(
    async (req, res) => {
        const devices = await getDevicesByAccessCode(
            req.params.accessCodeId
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.DEVICES_FETCHED,
            {
                devices
            }
        );
    }
);

export const getById = asyncHandler(
    async (req, res) => {
        const device = await getDeviceById(
            req.params.id
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.DEVICE_FETCHED,
            {
                device
            }
        );
    }
);

export const getStats = asyncHandler(
    async (req, res) => {
        const stats = await getDeviceStats(
            req.params.accessCodeId
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.DEVICE_STATISTICS_FETCHED,
            {
                stats
            }
        );
    }
);