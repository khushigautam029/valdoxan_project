import User from "../models/user.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/password.js";

export const loginUser = async (email, password) => {
    const user = await User.findOne({
        where: {
            email
        }
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

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