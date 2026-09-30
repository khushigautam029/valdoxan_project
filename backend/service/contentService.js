import sequelize from "../config/database.js";
import Category from "../models/category.js";
import Content from "../models/content.js";
import AppError from "../utils/appError.js";
import {
    STATUS_CODES
} from "../utils/setConstants.js";

const formatContentStatus = (status) => {
    return status === "PUBLISHED"
        ? "published"
        : "draft";
};

const getCategory = async (categoryId) => {
    const category = await Category.findOne({
        where: {
            id: categoryId,
            status: "ACTIVE"
        }
    });

    if (!category) {
        throw new AppError(
            "Active category not found",
            STATUS_CODES.NOT_FOUND
        );
    }

    return category;
};


export const getAllContent = async ({
    status,
    categoryId,
    page = 1,
    limit = 10
}) => {
    const where = {};

    if (status === "published") {
        where.status = "PUBLISHED";
    }

    if (status === "draft") {
        where.status = "DRAFT";
    }

    if (categoryId) {
        where.categoryId = categoryId;
    }

    const offset = (page - 1) * limit;

    const {
        count,
        rows
    } = await Content.findAndCountAll({
        where,

        include: [
            {
                model: Category,
                as: "category",
                attributes: [
                    "id",
                    "name"
                ]
            }
        ],

        attributes: [
            "id",
            "sortOrder",
            "title",
            "status",
            "updatedAt"
        ],

        order: [
            ["sortOrder", "ASC"],
            ["updatedAt", "DESC"]
        ],

        limit,
        offset
    });

    const content = rows.map((item) => ({
        id: item.id,
        sort_order: item.sortOrder,
        title: item.title,
        category_id: item.category?.id || null,
        category_name: item.category?.name || null,
        status: formatContentStatus(item.status),
        updated_at: item.updatedAt
    }));

    return {
        content,

        pagination: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: count,
            totalPages: Math.ceil(
                count / limit
            )
        }
    };
};

export const getContentById = async (id) => {
    const content = await Content.findByPk(id, {
        include: [
            {
                model: Category,
                as: "category",
                attributes: [
                    "id",
                    "name"
                ]
            }
        ]
    });

    if (!content) {
        throw new AppError(
            "Content not found",
            STATUS_CODES.NOT_FOUND
        );
    }

    return {
        id: content.id,
        title: content.title,
        category_id: content.categoryId,
        category_name: content.category?.name || null,
        sort_order: content.sortOrder,
        status: formatContentStatus(content.status),
        body: content.body,
        image_url: content.imageUrl,
        external_link: content.externalLink,
        created_at: content.createdAt,
        updated_at: content.updatedAt
    };
};

export const createContent = async (data) => {
    await getCategory(
        data.categoryId
    );
    const content = await Content.create({
        categoryId: data.categoryId,
        title: data.title,
        sortOrder: data.sortOrder,
        status:
            data.status === "published"
                ? "PUBLISHED"
                : "DRAFT",
        body: data.body,
        imageUrl:
            data.imageUrl || null,
        externalLink:
            data.externalLink || null
    });
    return await getContentById(
        content.id
    );
};

export const updateContent = async (
    id,
    data
) => {
    const content =
        await Content.findByPk(id);
    if (!content) {
        throw new AppError(
            "Content not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    if (data.categoryId !== undefined) {
        await getCategory(
            data.categoryId
        );
    }
    const updateData = {};
    if (data.title !== undefined) {
        updateData.title = data.title;
    }
    if (data.categoryId !== undefined) {
        updateData.categoryId =
            data.categoryId;
    }
    if (data.sortOrder !== undefined) {
        updateData.sortOrder =
            data.sortOrder;
    }
    if (data.status !== undefined) {
        updateData.status =
            data.status === "published"
                ? "PUBLISHED"
                : "DRAFT";
    }
    if (data.body !== undefined) {
        updateData.body = data.body;
    }
    if (data.imageUrl !== undefined) {
        updateData.imageUrl =
            data.imageUrl;
    }
    if (data.externalLink !== undefined) {
        updateData.externalLink =
            data.externalLink;
    }
    await content.update(
        updateData
    );
    return await getContentById(id);
};

export const updateContentStatus = async (
    id,
    status
) => {
    const content =
        await Content.findByPk(id);
    if (!content) {
        throw new AppError(
            "Content not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    const newStatus =
        status === "published"
            ? "PUBLISHED"
            : "DRAFT";
    await content.update({
        status: newStatus
    });
    return await getContentById(id);
};

export const reorderContent = async (
    items
) => {
    const transaction =
        await sequelize.transaction();
    try {
        for (const item of items) {
            const content =
                await Content.findByPk(
                    item.id,
                    { transaction }
                );
            if (!content) {
                throw new AppError(
                    `Content with ID ${item.id} not found`,
                    STATUS_CODES.NOT_FOUND
                );
            }
            await content.update(
                {
                    sortOrder:
                        item.sortOrder
                },
                {
                    transaction
                }
            );
        }
        await transaction.commit();
        return await getAllContent({
            status: "all",
            page: 1,
            limit: 10
        });
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};