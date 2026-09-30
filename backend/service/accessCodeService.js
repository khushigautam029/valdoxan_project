import { Op } from "sequelize";
import AccessCode from "../models/accessCode.js";
import Device from "../models/device.js";
import AppError from "../utils/appError.js";
import {
    STATUS_CODES
} from "../utils/setConstants.js";

export const createAccessCode = async (data) => {
    const existingCode = await AccessCode.findOne({
        where: {
            code: data.code
        }
    });

    if (existingCode) {
        throw new AppError(
            "Access code already exists",
            STATUS_CODES.CONFLICT
        );
    }

    const accessCode = await AccessCode.create({
        code: data.code,
        description: data.description || null,
        status: "ACTIVE"
    });

    return accessCode;
};

export const getAccessCodes = async (
    search,
    page = 1,
    limit = 10
) => {
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

    const offset = (page - 1) * limit;

    const {
        count,
        rows
    } = await AccessCode.findAndCountAll({
        where,

        include: [
            {
                model: Device,
                as: "devices",
                attributes: ["id"]
            }
        ],

        distinct: true,

        order: [
            ["createdAt", "DESC"]
        ],

        limit,
        offset
    });

    return {
        accessCodes: rows,

        pagination: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: count,
            totalPages: Math.ceil(
                count / limit
            )
        }
    };
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
        throw new AppError(
            "Access code not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    return accessCode;
};

export const updateAccessCode = async (id, data) => {
    const accessCode = await AccessCode.findByPk(id);

    if (!accessCode) {
        throw new AppError(
            "Access code not found",
            STATUS_CODES.NOT_FOUND
        );
    }

    if (data.code && data.code !== accessCode.code) {
        const existingCode = await AccessCode.findOne({
            where: {
                code: data.code
            }
        });
        if (existingCode) {
            throw new AppError(
                "Access code already exists",
                STATUS_CODES.CONFLICT
            );
        }
    }
    await accessCode.update(data);
    return accessCode;
};

export const deleteAccessCode = async (id) => {
    const accessCode = await AccessCode.findByPk(id);

    if (!accessCode) {
        throw new AppError(
            "Access code not found",
            STATUS_CODES.NOT_FOUND
        );
    }

    await accessCode.update({
        status: "INACTIVE"
    });

    return accessCode;
};

export const getDeviceStats = async (accessCodeId) => {
    const accessCode = await AccessCode.findByPk(accessCodeId);

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
        (device) => device.platform === "IOS"
    ).length;

    const androidDevices = devices.filter(
        (device) => device.platform === "ANDROID"
    ).length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7
    );

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
        throw new AppError(
            "Access code not found",
            STATUS_CODES.NOT_FOUND
        );
    }

    const devices = await Device.findAll({
        where: {
            accessCodeId
        },
        order: [
            ["lastSync", "DESC"]
        ]
    });

    return devices;
};
