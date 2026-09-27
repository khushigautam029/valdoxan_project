import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define(
    "Category",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },

        description: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
            allowNull: false,
            defaultValue: "ACTIVE"
        },

        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: "Category",
        timestamps: true
    }
);

export default Category;