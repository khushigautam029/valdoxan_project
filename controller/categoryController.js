import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory
} from "../service/categoryService.js";


export const create = async (req, res, next) => {
    try {
        const category = await createCategory(req.body);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
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

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
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

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
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

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
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

        return res.status(200).json({
            success: true,
            message: "Category removed successfully",
            data: {
                category
            }
        });
    } catch (error) {
        next(error);
    }
};