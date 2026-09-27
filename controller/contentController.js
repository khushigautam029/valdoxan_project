import {
    createContent,
    getAllContent,
    getContentById,
    reorderContent,
    updateContent,
    updateContentStatus
} from "../service/contentService.js";


export const getAll = async (req, res, next) => {
    try {
        const {
            status = "all",
            category_id
        } = req.query;

        if (
            !["all", "published", "draft"].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Status must be all, published, or draft"
            });
        }

        let categoryId;

        if (category_id !== undefined) {
            categoryId = Number(category_id);

            if (
                !Number.isInteger(categoryId) ||
                categoryId <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Category ID must be a positive integer"
                });
            }
        }

        const content = await getAllContent({
            status,
            categoryId
        });

        return res.status(200).json({
            success: true,
            message: "Content fetched successfully",
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

        return res.status(200).json({
            success: true,
            message: "Content fetched successfully",
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

        return res.status(201).json({
            success: true,
            message: "Content created successfully",
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

        return res.status(200).json({
            success: true,
            message: "Content updated successfully",
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

        return res.status(200).json({
            success: true,
            message: "Content status updated successfully",
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

        return res.status(200).json({
            success: true,
            message: "Content reordered successfully",
            data: {
                content
            }
        });
    } catch (error) {
        next(error);
    }
};