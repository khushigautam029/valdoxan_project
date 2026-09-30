import api from "./api.js";

export const getAccessCodes = async (
    search = "",
    page = 1,
    limit = 10
) => {
    const response = await api.get("/access-codes", {
        params: {
            page,
            limit,
            ...(search ? { search } : {})
        }
    });

    return response.data;
};

export const getAccessCodeById = async (id) => {
    const response = await api.get(
        `/access-codes/${id}`
    );

    return response.data;
};

export const createAccessCode = async (data) => {
    const response = await api.post(
        "/access-codes",
        data
    );

    return response.data;
};

export const updateAccessCode = async (
    id,
    data
) => {
    const response = await api.put(
        `/access-codes/${id}`,
        data
    );

    return response.data;
};

export const deleteAccessCode = async (id) => {
    const response = await api.delete(
        `/access-codes/${id}`
    );

    return response.data;
};

export const getAccessCodeStats = async (id) => {
    const response = await api.get(
        `/access-codes/${id}/device-stats`
    );

    return response.data;
};

export const getAccessCodeDevices = async (id) => {
    const response = await api.get(
        `/access-codes/${id}/devices`
    );

    return response.data;
};