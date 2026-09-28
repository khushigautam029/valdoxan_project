import {
    createAccessCode,
    deleteAccessCode,
    getAccessCodeById,
    getAccessCodes,
    getDeviceStats,
    getDevicesByAccessCode,
    updateAccessCode
} from "../service/accessCodeService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

export const create = asyncHandler(
    async (req, res) => {
        const accessCode = await createAccessCode(
            req.body
        );
        return sendSuccess(
            res,
            STATUS_CODES.CREATED,
            MESSAGES.ACCESS_CODE_CREATED,
            {
                accessCode
            }
        );
    }
);

export const getAll = asyncHandler(
    async (req, res) => {
        const { search } = req.query;
        const accessCodes = await getAccessCodes(
            search
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.ACCESS_CODES_FETCHED,
            {
                accessCodes
            }
        );
    }
);

export const getById = asyncHandler(
    async (req, res) => {
        const accessCode = await getAccessCodeById(
            req.params.id
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.ACCESS_CODE_FETCHED,
            {
                accessCode
            }
        );
    }
);

export const update = asyncHandler(
    async (req, res) => {
        const accessCode = await updateAccessCode(
            req.params.id,
            req.body
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.ACCESS_CODE_UPDATED,
            {
                accessCode
            }
        );
    }
);

export const remove = asyncHandler(
    async (req, res) => {
        const accessCode = await deleteAccessCode(
            req.params.id
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.ACCESS_CODE_REMOVED,
            {
                accessCode
            }
        );
    }
);

export const getDevices = asyncHandler(
    async (req, res) => {
        const devices = await getDevicesByAccessCode(
            req.params.id
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

export const getStats = asyncHandler(
    async (req, res) => {
        const stats = await getDeviceStats(
            req.params.id
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