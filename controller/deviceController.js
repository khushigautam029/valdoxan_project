import {
    getDeviceById,
    getDevicesByAccessCode,
    getDeviceStats
} from "../service/deviceService.js";


export const getByAccessCode = async (req, res, next) => {
    try {
        const devices = await getDevicesByAccessCode(
            req.params.accessCodeId
        );

        return res.status(200).json({
            success: true,
            message: "Devices fetched successfully",
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

        return res.status(200).json({
            success: true,
            message: "Device fetched successfully",
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

        return res.status(200).json({
            success: true,
            message: "Device statistics fetched successfully",
            data: {
                stats
            }
        });
    } catch (error) {
        next(error);
    }
};