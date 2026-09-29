import api from "./api.js";


/*
    Get all devices for an access code
*/
export const getDevicesByAccessCode = async (
    accessCodeId
) => {

    const response = await api.get(
        `/devices/access-code/${accessCodeId}`
    );

    return response.data;
};


/*
    Get device statistics for an access code
*/
export const getDeviceStats = async (
    accessCodeId
) => {

    const response = await api.get(
        `/devices/access-code/${accessCodeId}/stats`
    );

    return response.data;
};


/*
    Get a single device
*/
export const getDeviceById = async (
    id
) => {

    const response = await api.get(
        `/devices/${id}`
    );

    return response.data;
};