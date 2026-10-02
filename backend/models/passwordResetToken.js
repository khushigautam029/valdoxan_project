import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PasswordResetToken = sequelize.define(
    "PasswordResetToken",
    {
        id : {
            type : DataTypes.INTEGER,
            primaryKey :true,
            autoIncrement : true,
        },
        userId :{
            type : DataTypes.INTEGER,
            allowNull : false,
        },
        token:{
            type : DataTypes.STRING(255),
            allowNull : false,
            unique: true
        },
        expiresAt :{
            type : DataTypes.DATE,
            allowNull : false,
        },
        used :{
            type: DataTypes.BOOLEAN,
            defaultValue : false,
            allowNull : false,
        }
    },
    {
        tableName: "PasswordResetToken",
        timestamps: true
    }
);

export default PasswordResetToken;