import { loginUser } from "../service/userService.js";

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await loginUser(email, password);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (error) {
        next(error);
    }
};