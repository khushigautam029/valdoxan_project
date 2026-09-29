import api from "./api.js";

/*
    Get all access codes

    Optional search parameter:
    GET /api/access-codes?search=VDX
*/
export const getAccessCodes = async (search = "") => {
    const response = await api.get("/access-codes", {
        params: search
            ? { search }
            : {}
    });

    return response.data;
};


/*
    Get single access code
*/
export const getAccessCodeById = async (id) => {
    const response = await api.get(
        `/access-codes/${id}`
    );

    return response.data;
};


/*
    Create access code
*/
export const createAccessCode = async (data) => {
    const response = await api.post(
        "/access-codes",
        data
    );

    return response.data;
};


/*
    Update access code
*/
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


/*
    Remove / deactivate access code
*/
export const deleteAccessCode = async (id) => {
    const response = await api.delete(
        `/access-codes/${id}`
    );

    return response.data;
};


/*
    Get device statistics for an access code
*/
export const getAccessCodeStats = async (id) => {
    const response = await api.get(
        `/access-codes/${id}/device-stats`
    );

    return response.data;
};


/*
    Get devices belonging to an access code
*/
export const getAccessCodeDevices = async (id) => {
    const response = await api.get(
        `/access-codes/${id}/devices`
    );

    return response.data;
};