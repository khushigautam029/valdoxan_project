import api from "./api.js";

export const getDashboardStats = async ({
    from,
    to,
    platform = "ALL"
}) => {
    const response = await api.get(
        "/dashboard/stats",
        {
            params: {
                from,
                to,
                platform
            }
        }
    );
    return response.data;
};