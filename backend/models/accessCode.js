import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AccessCode = sequelize.define(
    "AccessCode",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        code: {
            type: DataTypes.STRING(100),
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
        }
    },
    {
        tableName: "AccessCode",
        timestamps: true
    }
);

export default AccessCode;