import { OtpVerification } from "../models/index.js";
import { sendOtpEmail } from "./emailService.js";

const generateOtp = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

export const createAndSendOtp = async (
    email,
    passwordHash
) => {
    const otp = generateOtp();

    const expiresAt = new Date(
        Date.now() + 10 * 60 * 1000
    );

    // Invalidate previous unused OTPs
    await OtpVerification.update(
        {
            verifiedAt: new Date()
        },
        {
            where: {
                email,
                verifiedAt: null
            }
        }
    );

    await OtpVerification.create({
        email,
        otp,
        passwordHash,
        expiresAt
    });

    await sendOtpEmail(email, otp);

    return {
        expiresAt
    };
};