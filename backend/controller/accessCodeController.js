import {
    createAccessCode,
    deleteAccessCode,
    getAccessCodeById,
    getAccessCodes,
    getDeviceStats,
    getDevicesByAccessCode,
    updateAccessCode
} from "../service/accessCodeService.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

export const create = async (req, res, next) => {
    try {
        const accessCode = await createAccessCode(req.body);
        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.ACCESS_CODE_CREATED,
            data: {
                accessCode
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const { search } = req.query;
        const accessCodes = await getAccessCodes(search);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.ACCESS_CODES_FETCHED,
            data: {
                accessCodes
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const accessCode = await getAccessCodeById(req.params.id);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.ACCESS_CODE_FETCHED,
            data: {
                accessCode
            }
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const accessCode = await updateAccessCode(
            req.params.id,
            req.body
        );
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.ACCESS_CODE_UPDATED,
            data: {
                accessCode
            }
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const accessCode = await deleteAccessCode(req.params.id);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.ACCESS_CODE_REMOVED,
            data: {
                accessCode
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getDevices = async (req, res, next) => {
    try {
        const devices = await getDevicesByAccessCode(
            req.params.id
        );
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.DEVICES_FETCHED,
            data: {
                devices
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getStats = async (req, res, next) => {
    try {
        const stats = await getDeviceStats(
            req.params.id
        );
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.DEVICE_STATISTICS_FETCHED,
            data: {
                stats
            }
        });
    } catch (error) {
        next(error);
    }
};