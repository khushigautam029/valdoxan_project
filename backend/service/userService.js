import { PasswordResetToken, User } from "../models/index.js";
import AppError from "../utils/appError.js";
import { generateToken } from "../utils/jwt.js";
import {
    comparePassword,
    hashPassword
} from "../utils/password.js";
import {
    generateResetToken,
    hashResetToken
} from "../utils/resetToken.js";
import {
    STATUS_CODES
} from "../utils/setConstants.js";

import { sendEmail } from "../utils/email.js";

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
        email: user.email,
        tokenVersion: user.tokenVersion
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

export const logoutUser = async (userId) => {
    await User.increment("tokenVersion", { where: { id: userId } });
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
    user.tokenVersion += 1;

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
    user.tokenVersion += 1;

    await user.save();

    return {
        message: "Account deleted successfully"
    };
};

export const forgotPassword = async (email) => {
    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        return {
            message:
                "If an account exists with this email, a password reset link has been sent."
        };
    }

    if (user.status !== "ACTIVE") {
        return {
            message:
                "If an account exists with this email, a password reset link has been sent."
        };
    }

    const resetToken = generateResetToken();

    const hashedToken = hashResetToken(
        resetToken
    );

    const expiresAt = new Date(
        Date.now() + 15 * 60 * 1000
    );

    await PasswordResetToken.update(
        {
            used: true
        },
        {
            where: {
                userId: user.id,
                used: false
            }
        }
    );

    await PasswordResetToken.create({
        userId: user.id,
        token: hashedToken,
        expiresAt,
        used: false
    });

    const resetUrl =
        `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Reset your Valdoxan Admin Password",

        text: `
You requested to reset your Valdoxan Admin password.

Reset your password using this link:

${resetUrl}

This link will expire in 15 minutes.

If you did not request this password reset, you can safely ignore this email.
        `,

        html: `
            <div>
                <h2>Reset your Valdoxan Admin Password</h2>

                <p>
                    You requested to reset your Valdoxan Admin password.
                </p>

                <p>
                    Click the button below to reset your password:
                </p>

                <p>
                    <a
                        href="${resetUrl}"
                        target="_blank"
                    >
                        Reset Password
                    </a>
                </p>

                <p>
                    This link will expire in 15 minutes.
                </p>

                <p>
                    If you did not request this password reset,
                    you can safely ignore this email.
                </p>
            </div>
        `
    });

    return {
        message:
            "If an account exists with this email, a password reset link has been sent."
    };
};
