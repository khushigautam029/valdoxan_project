import api from "./api.js";

export const loginAdmin = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password
    });

    return response.data;
};

export const verifyAdminOtp = async (email, otp , keepSignedIn) => {
    const response = await api.post("/auth/verify-otp", {
        email,
        otp,
        keepSignedIn
    });

    return response.data;
};

// export const getCurrentAdmin = async () => {
//     const response = await api.get("/auth/me");

//     return response.data;
// };

export const logoutAdmin = async () => {
    try {
        const response = await api.post("/auth/logout");

        return response.data;

    } finally {

        // Always clear local authentication
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("loginEmail");
        sessionStorage.removeItem("keepSignedIn");
    }
};