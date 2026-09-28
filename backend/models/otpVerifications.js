import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OtpVerification = sequelize.define(
    "OtpVerification",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        otp: {
            type: DataTypes.STRING(6),
            allowNull: false
        },

        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },

        verifiedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "OtpVerification",
        timestamps: true
    }
);

export default OtpVerification;