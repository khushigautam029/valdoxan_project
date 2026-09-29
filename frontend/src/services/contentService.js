import api from "./api.js";

// Get all content
export const getContent = async (status = "all", categoryId = "") => {
    const params = {};
    if (status && status !== "all") {
        params.status = status;
    }
    if (categoryId) {
        params.category_id = categoryId;
    }
    const response = await api.get("/content", { params });
    return response.data;
};

// Get content by ID
export const getContentById = async (id) => {
    const response = await api.get(`/content/${id}`);
    return response.data;
};

// Create content
export const createContent = async (data) => {
    const response = await api.post("/content", data);
    return response.data;
};

// Update content
export const updateContent = async (id, data) => {
    const response = await api.put(`/content/${id}`, data);
    return response.data;
};

// Update publish/draft status
export const updateContentStatus = async (id, status) => {
    const response = await api.patch(`/content/${id}/status`, {
        status
    });
    return response.data;
};

// Reorder content
export const reorderContent = async (items) => {
    const response = await api.patch("/content/reorder", items);
    return response.data;
};

// Upload content image
export const uploadContentImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post(
        "/content/upload-image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return response.data;
};