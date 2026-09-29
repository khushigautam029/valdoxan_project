import { OtpVerification, User } from "../models/index.js";
import AppError from "../utils/appError.js";
import { generateToken } from "../utils/jwt.js";
import { createAndSendOtp } from "../utils/otpService.js";
import {
    comparePassword,
    hashPassword
} from "../utils/password.js";
import {
    STATUS_CODES
} from "../utils/setConstants.js";

export const loginUser = async (email, password) => {
    const user = await User.findOne({
        where: {
            email
        }
    });

    if (user) {
        if (user.status !== "ACTIVE") {
            throw new AppError(
                "Your account is inactive",
                STATUS_CODES.UNAUTHORIZED
            );
        }
        const isPasswordValid = await comparePassword(
            password,
            user.password
        );
        if (!isPasswordValid) {
            throw new AppError(
                "Invalid email or password",
                STATUS_CODES.UNAUTHORIZED
            );
        }

        await createAndSendOtp(
            email,
            user.password
        );
        return {
            email,
            isNewAdmin: false,
            message: "OTP sent successfully"
        };
    }
    const passwordHash = await hashPassword(
        password
    );
    await createAndSendOtp(
        email,
        passwordHash
    );
    return {
        email,
        isNewAdmin: true,
        message: "OTP sent successfully"
    };
};

export const verifyLoginOtp = async (
    email,
    otp
) => {
    const otpRecord = await OtpVerification.findOne({
        where: {
            email,
            otp,
            verifiedAt: null
        },
        order: [
            ["createdAt", "DESC"]
        ]
    });
    if (!otpRecord) {
        throw new AppError(
            "Invalid OTP",
            STATUS_CODES.UNAUTHORIZED
        );
    }
    if (new Date() > otpRecord.expiresAt) {
        throw new AppError(
            "OTP has expired",
            STATUS_CODES.UNAUTHORIZED
        );
    }
    let user = await User.findOne({
        where: {
            email
        }
    });

    if (!user) {
        if (!otpRecord.passwordHash) {
            throw new AppError(
                "Unable to create admin account",
                STATUS_CODES.INTERNAL_SERVER_ERROR
            );
        }
        user = await User.create({
            name: "Admin",
            email,
            password: otpRecord.passwordHash,
            status: "ACTIVE"
        });
    }

    if (user.status !== "ACTIVE") {
        throw new AppError(
            "Your account is inactive",
            STATUS_CODES.UNAUTHORIZED
        );
    }

    await otpRecord.update({
        verifiedAt: new Date()
    });
    const token = generateToken({
        id: user.id,
        email: user.email
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status
        }
    };
};


export const getMe = async (userId) => {
    const user = await User.findByPk(
        userId,
        {
            attributes: [
                "id",
                "name",
                "email",
                "status",
                "createdAt",
                "updatedAt"
            ]
        }
    );
    if (!user) {
        throw new AppError(
            "Admin user not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    if (user.status !== "ACTIVE") {
        throw new AppError(
            "Your account is inactive",
            STATUS_CODES.UNAUTHORIZED
        );
    }
    return user;
};

export const logoutUser = async () => {
    return {
        message: "Logged out successfully"
    };
};

export const updateProfile = async (userId, name) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError(
            "Admin user not found",
            STATUS_CODES.NOT_FOUND
        );
    }

    if (user.status !== "ACTIVE") {
        throw new AppError(
            "Your account is inactive",
            STATUS_CODES.UNAUTHORIZED
        );
    }

    user.name = name.trim();

    await user.save();

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status
    };
};

export const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError(
            "Admin user not found",
            STATUS_CODES.NOT_FOUND
        );
    }

    if (user.status !== "ACTIVE") {
        throw new AppError(
            "Your account is inactive",
            STATUS_CODES.UNAUTHORIZED
        );
    }

    const isCurrentPasswordValid = await comparePassword(
        currentPassword,
        user.password
    );

    if (!isCurrentPasswordValid) {
        throw new AppError(
            "Current password is incorrect",
            STATUS_CODES.UNAUTHORIZED
        );
    }

    const isSamePassword = await comparePassword(
        newPassword,
        user.password
    );

    if (isSamePassword) {
        throw new AppError(
            "New password must be different from current password",
            STATUS_CODES.BAD_REQUEST
        );
    }

    user.password = await hashPassword(newPassword);

    await user.save();

    return {
        message: "Password changed successfully"
    };
};

export const deleteAccount = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError(
            "Admin user not found",
            STATUS_CODES.NOT_FOUND
        );
    }

    if (user.status !== "ACTIVE") {
        throw new AppError(
            "Your account is already inactive",
            STATUS_CODES.UNAUTHORIZED
        );
    }

    user.status = "INACTIVE";

    await user.save();

    return {
        message: "Account deleted successfully"
    };
};