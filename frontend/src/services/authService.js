import api from "./api.js";

export const loginAdmin = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password
    });

    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", {
        email
    });

    return response.data;
};

export const resetPassword = async (
    token,
    newPassword,
    confirmPassword
) => {
    const response = await api.post(
        "/auth/reset-password",
        {
            token,
            newPassword,
            confirmPassword
        }
    );
    return response.data;
};

export const logoutAdmin = async () => {
    try {
        const response = await api.post("/auth/logout");
        return response.data;
    } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
    }
};