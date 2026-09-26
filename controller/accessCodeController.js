import {
    createAccessCode,
    deleteAccessCode,
    getAccessCodeById,
    getAccessCodes,
    getDeviceStats,
    getDevicesByAccessCode,
    updateAccessCode
} from "../service/accessCodeService.js";


export const create = async (req, res, next) => {
    try {
        const accessCode = await createAccessCode(req.body);

        return res.status(201).json({
            success: true,
            message: "Access code created successfully",
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

        return res.status(200).json({
            success: true,
            message: "Access codes fetched successfully",
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

        return res.status(200).json({
            success: true,
            message: "Access code fetched successfully",
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

        return res.status(200).json({
            success: true,
            message: "Access code updated successfully",
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

        return res.status(200).json({
            success: true,
            message: "Access code removed successfully",
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


export const getStats = async (req, res, next) => {
    try {
        const stats = await getDeviceStats(
            req.params.id
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