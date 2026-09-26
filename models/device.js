import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Device = sequelize.define(
    "Device",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        deviceId: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        platform: {
            type: DataTypes.ENUM("IOS", "ANDROID"),
            allowNull: false
        },

        osVersion: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        accessCodeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        lastSync: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "Device",
        timestamps: true
    }
);

export default Device;