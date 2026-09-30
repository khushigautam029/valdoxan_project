import api from "./api.js";

export const getNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};

export const getNotificationById = async (id) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
};

export const createNotification = async (data) => {
    const response = await api.post("/notifications", data);
    return response.data;
};

export const updateNotification = async (id, data) => {
    const response = await api.put(`/notifications/${id}`, data);
    return response.data;
};

export const deleteNotification = async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};

export const cancelNotification = deleteNotification;

export const updateNotificationStatus = async (id, status) => {
    const response = await api.patch(`/notifications/${id}/status`, {
        status
    });

    return response.data;
};

export const sendNotification = async (id) => {
    const response = await api.post(`/notifications/${id}/send`);
    return response.data;
};