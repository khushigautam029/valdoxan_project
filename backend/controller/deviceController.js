import {
    getDeviceById,
    getDevicesByAccessCode,
    getDeviceStats
} from "../service/deviceService.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

export const getByAccessCode = async (req, res, next) => {
    try {
        const devices = await getDevicesByAccessCode(
            req.params.accessCodeId
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

export const getById = async (req, res, next) => {
    try {
        const device = await getDeviceById(
            req.params.id
        );
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.DEVICE_FETCHED,
            data: {
                device
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getStats = async (req, res, next) => {
    try {
        const stats = await getDeviceStats(
            req.params.accessCodeId
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