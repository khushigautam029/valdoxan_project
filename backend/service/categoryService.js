import { Op } from "sequelize";
import Category from "../models/category.js";
import AppError from "../utils/appError.js";
import {
    STATUS_CODES
} from "../utils/setConstants.js";


export const createCategory = async (data) => {
    const existingCategory =
        await Category.findOne({
            where: {
                name: data.name
            }
        });
    if (existingCategory) {
        throw new AppError(
            "Category already exists",
            STATUS_CODES.CONFLICT
        );
    }
    const category = await Category.create({
        name: data.name,
        description:
            data.description || null,
        status:
            data.status || "ACTIVE",
        sortOrder:
            data.sortOrder ?? 0
    });
    return category;
};


export const getCategories = async (
    search
) => {
    const where = {};
    if (search) {
        where.name = {
            [Op.like]: `%${search}%`
        };
    }
    return await Category.findAll({
        where,
        order: [
            ["sortOrder", "ASC"],
            ["createdAt", "ASC"]
        ]
    });
};


export const getCategoryById = async (
    id
) => {
    const category =
        await Category.findByPk(id);
    if (!category) {
        throw new AppError(
            "Category not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    return category;
};


export const updateCategory = async (
    id,
    data
) => {
    const category =
        await Category.findByPk(id);
    if (!category) {
        throw new AppError(
            "Category not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    if (
        data.name &&
        data.name !== category.name
    ) {
        const existingCategory =
            await Category.findOne({
                where: {
                    name: data.name,
                    id: {
                        [Op.ne]: id
                    }
                }
            });
        if (existingCategory) {
            throw new AppError(
                "Category already exists",
                STATUS_CODES.CONFLICT
            );
        }
    }
    await category.update(data);
    return category;
};


export const deleteCategory = async (
    id
) => {
    const category =
        await Category.findByPk(id);
    if (!category) {
        throw new AppError(
            "Category not found",
            STATUS_CODES.NOT_FOUND
        );
    }
    await category.update({
        status: "INACTIVE"
    });
    return category;
};