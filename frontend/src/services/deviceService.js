import api from "./api.js";

export const getDevicesByAccessCode = async (
    accessCodeId
) => {
    const response = await api.get(
        `/devices/access-code/${accessCodeId}`
    );
    return response.data;
};

export const getDeviceStats = async (
    accessCodeId
) => {
    const response = await api.get(
        `/devices/access-code/${accessCodeId}/stats`
    );
    return response.data;
};

export const getDeviceById = async (
    id
) => {
    const response = await api.get(
        `/devices/${id}`
    );
    return response.data;
};