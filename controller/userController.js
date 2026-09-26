import {
    getMe,
    loginUser,
    registerUser
} from "../service/userService.js";

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await registerUser(
            name,
            email,
            password
        );

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await loginUser(
            email,
            password
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

export const get = async (req, res, next) => {
    try {
        const user = await getMe(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Admin details fetched successfully",
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};