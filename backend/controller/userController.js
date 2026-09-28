import {
    getMe,
    loginUser,
    verifyLoginOtp
} from "../service/userService.js";

export const login = async (req, res, next) => {
    try {
        const result = await loginUser(
            req.body.email,
            req.body.password
        );
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};


export const verifyOtp = async (req, res, next) => {
    try {
        const result = await verifyLoginOtp(
            req.body.email,
            req.body.otp
        );
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (error) {
        next(error);
    }
};


export const getMeController = async (
    req,
    res,
    next
) => {
    try {
        const user = await getMe(
            req.user.id
        );
        return res.status(200).json({
            success: true,
            message: "Admin profile fetched successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};