import { Op } from "sequelize";
import Category from "../model/category.js";


export const createCategory = async (data) => {
    const existingCategory = await Category.findOne({
        where: {
            name: data.name
        }
    });

    if (existingCategory) {
        throw new Error("Category already exists");
    }

    const category = await Category.create({
        name: data.name,
        description: data.description || null,
        status: data.status || "ACTIVE",
        sortOrder: data.sortOrder ?? 0
    });

    return category;
};


export const getCategories = async (search) => {
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


export const getCategoryById = async (id) => {
    const category = await Category.findByPk(id);

    if (!category) {
        throw new Error("Category not found");
    }

    return category;
};


export const updateCategory = async (id, data) => {
    const category = await Category.findByPk(id);

    if (!category) {
        throw new Error("Category not found");
    }

    if (data.name && data.name !== category.name) {
        const existingCategory = await Category.findOne({
            where: {
                name: data.name,
                id: {
                    [Op.ne]: id
                }
            }
        });

        if (existingCategory) {
            throw new Error("Category already exists");
        }
    }

    await category.update(data);

    return category;
};


export const deleteCategory = async (id) => {
    const category = await Category.findByPk(id);

    if (!category) {
        throw new Error("Category not found");
    }

    await category.update({
        status: "INACTIVE"
    });

    return category;
};