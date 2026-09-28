import AccessCode from "../models/accessCode.js";
import Device from "../models/device.js";
import AppError from "../utils/appError.js";
import {
    STATUS_CODES
} from "../utils/setConstants.js";

export const getDevicesByAccessCode = async (
    accessCodeId
) => {
    const accessCode =
        await AccessCode.findByPk(accessCodeId);
    if (!accessCode) {
        throw new AppError(
            "Access code not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    return await Device.findAll({
        where: {
            accessCodeId
        },
        order: [
            ["lastSync", "DESC"]
        ]
    });
};

export const getDeviceById = async (id) => {
    const device =
        await Device.findByPk(
            id,
            {
                include: [
                    {
                        model: AccessCode,
                        as: "accessCode",
                        attributes: [
                            "id",
                            "code",
                            "description",
                            "status"
                        ]
                    }
                ]
            }
        );
    if (!device) {
        throw new AppError(
            "Device not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    return device;
};


export const getDeviceStats = async (
    accessCodeId
) => {
    const accessCode =
        await AccessCode.findByPk(accessCodeId);
    if (!accessCode) {
        throw new AppError(
            "Access code not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    const devices = await Device.findAll({
        where: {
            accessCodeId
        }
    });
    const iosDevices = devices.filter(
        (device) =>
            device.platform === "IOS"
    ).length;
    const androidDevices = devices.filter(
        (device) =>
            device.platform === "ANDROID"
    ).length;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7
    );
    const syncedInLast7Days =
        devices.filter(
            (device) =>
                device.lastSync &&
                new Date(device.lastSync) >=
                    sevenDaysAgo
        ).length;
    return {
        iosDevices,
        androidDevices,
        syncedInLast7Days,
        totalDevices: devices.length
    };
};