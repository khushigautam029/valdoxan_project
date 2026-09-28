import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Notification = sequelize.define(
    "Notification",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        audience: {
            type: DataTypes.ENUM("ALL", "IOS", "ANDROID"),
            allowNull: false,
            defaultValue: "ALL"
        },

        deliveryType: {
            type: DataTypes.ENUM("NOW", "SCHEDULED"),
            allowNull: false,
            defaultValue: "NOW"
        },

        scheduledAt: {
            type: DataTypes.DATE,
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM(
                "DRAFT",
                "SCHEDULED",
                "SENT",
                "CANCELLED"
            ),
            allowNull: false,
            defaultValue: "DRAFT"
        },

        sentAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "Notification",
        timestamps: true
    }
);

export default Notification;