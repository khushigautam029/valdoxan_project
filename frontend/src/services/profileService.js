import api from "./api.js";

export const getMyProfile = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

export const updateMyProfile = async (data) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
};

export const changeMyPassword = async (data) => {
    const response = await api.put(
        "/auth/change-password",
        data
    );
    return response.data;
};

export const deleteMyAccount = async () => {
    const response = await api.delete(
        "/auth/account"
    );
    return response.data;
};