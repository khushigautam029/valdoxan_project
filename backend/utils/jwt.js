import jwt from "jsonwebtoken";

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET must be configured with at least 32 characters");
    }
    return secret;
};

export const generateToken = (payload) => {
    return jwt.sign(
        payload,
        getJwtSecret(),
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "12h"
        }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(
        token,
        getJwtSecret()
    );
};
