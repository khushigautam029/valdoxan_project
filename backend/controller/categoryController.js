import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory
} from "../service/categoryService.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

export const create = async (req, res, next) => {
    try {
        const category = await createCategory(req.body);
        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.CATEGORY_CREATED,
            data: {
                category
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const { search } = req.query;
        const categories = await getCategories(search);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.CATEGORIES_FETCHED,
            data: {
                categories
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const category = await getCategoryById(
            req.params.id
        );
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.CATEGORY_FETCHED,
            data: {
                category
            }
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const category = await updateCategory(
            req.params.id,
            req.body
        );
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.CATEGORY_UPDATED,
            data: {
                category
            }
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const category = await deleteCategory(
            req.params.id
        );
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.CATEGORY_REMOVED,
            data: {
                category
            }
        });
    } catch (error) {
        next(error);
    }
};