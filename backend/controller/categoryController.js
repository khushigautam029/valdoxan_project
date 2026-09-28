import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory
} from "../service/categoryService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES
} from "../utils/setConstants.js";

export const create = asyncHandler(
    async (req, res) => {
        const category = await createCategory(
            req.body
        );
        return sendSuccess(
            res,
            STATUS_CODES.CREATED,
            MESSAGES.CATEGORY_CREATED,
            {
                category
            }
        );
    }
);

export const getAll = asyncHandler(
    async (req, res) => {
        const { search } = req.query;
        const categories = await getCategories(
            search
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.CATEGORIES_FETCHED,
            {
                categories
            }
        );
    }
);

export const getById = asyncHandler(
    async (req, res) => {
        const category = await getCategoryById(
            req.params.id
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.CATEGORY_FETCHED,
            {
                category
            }
        );
    }
);

export const update = asyncHandler(
    async (req, res) => {
        const category = await updateCategory(
            req.params.id,
            req.body
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.CATEGORY_UPDATED,
            {
                category
            }
        );
    }
);

export const remove = asyncHandler(
    async (req, res) => {
        const category = await deleteCategory(
            req.params.id
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            MESSAGES.CATEGORY_REMOVED,
            {
                category
            }
        );
    }
);