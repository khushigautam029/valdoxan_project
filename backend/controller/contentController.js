import {
    createContent,
    getAllContent,
    getContentById,
    reorderContent,
    updateContent,
    updateContentStatus
} from "../service/contentService.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";


export const getAll = async (req, res, next) => {
    try {
        const {
            status = "all",
            category_id
        } = req.query;
        if (
            !["all", "published", "draft"].includes(status)
        ) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message:MESSAGES.STATUS
            });
        }
        let categoryId;
        if (category_id !== undefined) {
            categoryId = Number(category_id);
            if (
                !Number.isInteger(categoryId) ||
                categoryId <= 0
            ) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.CATEGORY_ID_INTEGER
                });
            }
        }
        const content = await getAllContent({
            status,
            categoryId
        });
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.CONTENT_FETCHED,
            data: {
                content
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const content = await getContentById(
            req.params.id
        );
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.CONTENT_FETCHED,
            data: {
                content
            }
        });
    } catch (error) {
        next(error);
    }
};


export const create = async (req, res, next) => {
    try {
        const content = await createContent(
            req.body
        );
        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            message:MESSAGES.CONTENT_CREATED,
            data: {
                content
            }
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const content = await updateContent(
            req.params.id,
            req.body
        );
        return res.status(MESSAGES.OK).json({
            success: true,
            message:MESSAGES.CONTENT_UPDATED,
            data: {
                content
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateStatus = async (
    req,
    res,
    next
) => {
    try {
        const content = await updateContentStatus(
            req.params.id,
            req.body.status
        );
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.CONTENT_STATUS_UPDATED,
            data: {
                content
            }
        });
    } catch (error) {
        next(error);
    }
};

export const reorder = async (req, res, next) => {
    try {
        const content = await reorderContent(
            req.body
        );
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.CONTENT_REORDERED,
            data: {
                content
            }
        });
    } catch (error) {
        next(error);
    }
};