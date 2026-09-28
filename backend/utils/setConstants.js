export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,

    INTERNAL_SERVER_ERROR: 500
};

export const MESSAGES = {
    ACCESS_CODE_CREATED:"Access code created successfully",
    ACCESS_CODES_FETCHED:"Access codes fetched successfully",
    ACCESS_CODE_FETCHED:"Access code fetched successfully",
    ACCESS_CODE_UPDATED:"Access code updated successfully",
    ACCESS_CODE_REMOVED:"Access code removed successfully",
    DEVICES_FETCHED:"Devices fetched successfully",
    DEVICE_STATISTICS_FETCHED:"Device statistics fetched successfully",

    CATEGORY_CREATED:"Category created successfully",
    CATEGORIES_FETCHED:"Categories fetched successfully",
    CATEGORY_FETCHED:"Category fetched successfully",
    CATEGORY_UPDATED:"Category updated successfully",
    CATEGORY_REMOVED:"Category removed successfully",

    STATUS:"Status must be all, published, or draft",
    CATEGORY_ID_INTEGER:"Category ID must be a positive integer",
    CONTENT_FETCHED:"Content fetched successfully",
    CONTENT_CREATED:"Content created successfully",
    CONTENT_UPDATED:"Content updated successfully",
    CONTENT_STATUS_UPDATED:"Content status updated successfully",
    CONTENT_REORDERED:"Content reordered successfully",

    PNG_IMAGE_FILE:"PNG image file is required",
    IMAGE_UPLOADED:"Image uploaded successfully"

}