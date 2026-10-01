import AccessCode from "../models/accessCode.js";
import Device from "../models/device.js";
import { Op } from "sequelize";
import AppError from "../utils/appError.js";
import {
    STATUS_CODES
} from "../utils/setConstants.js";

export const registerDevice = async ({
    deviceId,
    platform,
    osVersion,
    accessCode
}) => {
    const accessCodeRecord = await AccessCode.findOne({
        where: {
            code: accessCode,
            status: "ACTIVE"
        }
    });

    if (!accessCodeRecord) {
        throw new AppError(
            "Invalid or inactive access code",
            STATUS_CODES.NOT_FOUND
        );
    }

    let device = await Device.findOne({
        where: {
            deviceId
        }
    });

    if (device) {
        await device.update({
            platform,
            osVersion,
            accessCodeId: accessCodeRecord.id,
            lastSync: new Date()
        });
        return device;
    }

    device = await Device.create({
        deviceId,
        platform,
        osVersion,
        accessCodeId: accessCodeRecord.id,
        lastSync: new Date()
    });
    return device;
};

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
        ],
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


export const getDeviceStats = async (accessCodeId) => {
    const accessCode =
        await AccessCode.findByPk(accessCodeId);
    if (!accessCode) {
        throw new AppError(
            "Access code not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7
    );

    const [totalDevices, iosDevices, androidDevices, syncedInLast7Days] = await Promise.all([
        Device.count({ where: { accessCodeId } }),
        Device.count({ where: { accessCodeId, platform: "IOS" } }),
        Device.count({ where: { accessCodeId, platform: "ANDROID" } }),
        Device.count({ where: { accessCodeId, lastSync: { [Op.gte]: sevenDaysAgo } } })
    ]);

    return {
        iosDevices,
        androidDevices,
        syncedInLast7Days,
        totalDevices
    };
};
