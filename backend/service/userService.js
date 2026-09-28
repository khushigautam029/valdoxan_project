import { OtpVerification, User } from "../models/index.js";

import { generateToken } from "../utils/jwt.js";

import {
    comparePassword,
    hashPassword
} from "../utils/password.js";

import { createAndSendOtp } from "../utils/otpService.js";


export const loginUser = async (email, password) => {

    const user = await User.findOne({
        where: {
            email
        }
    });


    /*
     * Existing admin
     */
    if (user) {

        if (user.status !== "ACTIVE") {
            throw new Error("Your account is inactive");
        }

        const isPasswordValid = await comparePassword(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        /*
         * Existing admin:
         * password is correct,
         * now send OTP.
         */
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


    /*
     * First-time admin
     *
     * User does not exist yet.
     * Hash password now.
     * Account will only be created after
     * successful OTP verification.
     */

    const passwordHash = await hashPassword(password);

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


export const verifyLoginOtp = async (email, otp) => {

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
        throw new Error("Invalid OTP");
    }


    if (new Date() > otpRecord.expiresAt) {
        throw new Error("OTP has expired");
    }


    let user = await User.findOne({
        where: {
            email
        }
    });


    /*
     * First-time admin
     *
     * Create the account only after
     * successful OTP verification.
     */

    if (!user) {

        if (!otpRecord.passwordHash) {
            throw new Error(
                "Unable to create admin account"
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
        throw new Error("Your account is inactive");
    }


    /*
     * Mark OTP as used
     */

    await otpRecord.update({
        verifiedAt: new Date()
    });


    /*
     * Generate JWT
     */

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
        throw new Error("Admin user not found");
    }


    if (user.status !== "ACTIVE") {
        throw new Error("Your account is inactive");
    }


    return user;
};