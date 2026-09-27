import { Op } from "sequelize";
import AccessCode from "../models/accessCode.js";
import Device from "../models/device.js";

export const createAccessCode = async (data) => {
    const existingCode = await AccessCode.findOne({
        where: {
            code: data.code
        }
    });

    if (existingCode) {
        throw new Error("Access code already exists");
    }

    const accessCode = await AccessCode.create({
        code: data.code,
        description: data.description || null,
        status: "ACTIVE"
    });

    return accessCode;
};


export const getAccessCodes = async (search) => {
    const where = {};

    if (search) {
        where[Op.or] = [
            {
                code: {
                    [Op.like]: `%${search}%`
                }
            },
            {
                description: {
                    [Op.like]: `%${search}%`
                }
            }
        ];
    }

    return await AccessCode.findAll({
        where,
        include: [
            {
                model: Device,
                as: "devices",
                attributes: ["id"]
            }
        ],
        order: [["createdAt", "DESC"]]
    });
};


export const getAccessCodeById = async (id) => {
    const accessCode = await AccessCode.findByPk(id, {
        include: [
            {
                model: Device,
                as: "devices",
                attributes: [
                    "id",
                    "deviceId",
                    "platform",
                    "osVersion",
                    "lastSync"
                ]
            }
        ]
    });

    if (!accessCode) {
        throw new Error("Access code not found");
    }

    return accessCode;
};


export const updateAccessCode = async (id, data) => {
    const accessCode = await AccessCode.findByPk(id);

    if (!accessCode) {
        throw new Error("Access code not found");
    }

    if (data.code && data.code !== accessCode.code) {
        const existingCode = await AccessCode.findOne({
            where: {
                code: data.code
            }
        });

        if (existingCode) {
            throw new Error("Access code already exists");
        }
    }

    await accessCode.update(data);

    return accessCode;
};


export const deleteAccessCode = async (id) => {
    const accessCode = await AccessCode.findByPk(id);

    if (!accessCode) {
        throw new Error("Access code not found");
    }

    /*
     * Do NOT permanently delete the access code.
     * The UI calls this action "Remove", and the screenshot says:
     * "Removed codes lose access at the next connectivity check."
     */

    await accessCode.update({
        status: "INACTIVE"
    });

    return accessCode;
};


export const getDeviceStats = async (accessCodeId) => {
    const accessCode = await AccessCode.findByPk(accessCodeId);

    if (!accessCode) {
        throw new Error("Access code not found");
    }

    const devices = await Device.findAll({
        where: {
            accessCodeId
        }
    });

    const iosDevices = devices.filter(
        (device) => device.platform === "IOS"
    ).length;

    const androidDevices = devices.filter(
        (device) => device.platform === "ANDROID"
    ).length;

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const syncedInLast7Days = devices.filter(
        (device) =>
            device.lastSync &&
            new Date(device.lastSync) >= sevenDaysAgo
    ).length;

    return {
        iosDevices,
        androidDevices,
        syncedInLast7Days
    };
};


export const getDevicesByAccessCode = async (accessCodeId) => {
    const accessCode = await AccessCode.findByPk(accessCodeId);

    if (!accessCode) {
        throw new Error("Access code not found");
    }

    return await Device.findAll({
        where: {
            accessCodeId
        },
        order: [["lastSync", "DESC"]]
    });
};