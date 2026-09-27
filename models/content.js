import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Content = sequelize.define(
    "Content",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        status: {
            type: DataTypes.ENUM("DRAFT", "PUBLISHED"),
            allowNull: false,
            defaultValue: "DRAFT"
        },

        body: {
            type: DataTypes.TEXT("long"),
            allowNull: false
        },

        imageUrl: {
            type: DataTypes.STRING(500),
            allowNull: true
        },

        externalLink: {
            type: DataTypes.STRING(1000),
            allowNull: true
        }
    },
    {
        tableName: "Content",
        timestamps: true
    }
);

export default Content;