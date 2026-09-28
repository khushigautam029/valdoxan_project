import {
    createContent,
    getAllContent,
    getContentById,
    reorderContent,
    updateContent,
    updateContentStatus
} from "../service/contentService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    sendError,
    sendSuccess
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

export const getAll = asyncHandler(
    async (req, res) => {
        const {
            status = "all",
            category_id
        } = req.query;
        if (
            !["all", "published", "draft"].includes(status)
        ) {
            return sendError(
                res,
                STATUS_CODES.BAD_REQUEST,
                MESSAGES.STATUS
            );
        }
        let categoryId;
        if (category_id !== undefined) {
            categoryId = Number(category_id);
            if (
                !Number.isInteger(categoryId) ||
                categoryId <= 0
            ) {
                return sendError(
                    res,
                    STATUS_CODES.BAD_REQUEST,
                    MESSAGES.CATEGORY_ID_INTEGER
                );
            }
        }
        const content = await getAllContent({
            status,
            categoryId
        });
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.CONTENT_FETCHED,
            {
                content
            }
        );
    }
);

export const getById = asyncHandler(
    async (req, res) => {
        const content = await getContentById(
            req.params.id
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.CONTENT_FETCHED,
            {
                content
            }
        );
    }
);

export const create = asyncHandler(
    async (req, res) => {
        const content = await createContent(
            req.body
        );
        return sendSuccess(
            res,
            STATUS_CODES.CREATED,
            MESSAGES.CONTENT_CREATED,
            {
                content
            }
        );
    }
);

export const update = asyncHandler(
    async (req, res) => {
        const content = await updateContent(
            req.params.id,
            req.body
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.CONTENT_UPDATED,
            {
                content
            }
        );
    }
);

export const updateStatus = asyncHandler(
    async (req, res) => {
        const content = await updateContentStatus(
            req.params.id,
            req.body.status
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.CONTENT_STATUS_UPDATED,
            {
                content
            }
        );
    }
);

export const reorder = asyncHandler(
    async (req, res) => {
        const content = await reorderContent(
            req.body
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.CONTENT_REORDERED,
            {
                content
            }
        );
    }
);