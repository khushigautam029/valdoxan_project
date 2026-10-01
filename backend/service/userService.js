import { User } from "../models/index.js";
import AppError from "../utils/appError.js";
import { generateToken } from "../utils/jwt.js";
import {
    comparePassword,
    hashPassword
} from "../utils/password.js";
import {
    STATUS_CODES
} from "../utils/setConstants.js";

export const loginUser = async (email, password) => {
    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        throw new AppError(
            "Invalid email or password",
            STATUS_CODES.UNAUTHORIZED
        );
    }

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