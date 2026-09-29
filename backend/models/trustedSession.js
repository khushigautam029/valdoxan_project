// import { DataTypes } from "sequelize";
// import sequelize from "../config/database.js";

// const TrustedSession = sequelize.define(
//     "TrustedSession",
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true
//         },

//         userId: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         },

//         tokenHash: {
//             type: DataTypes.STRING(255),
//             allowNull: false,
//             unique: true
//         },

//         expiresAt: {
//             type: DataTypes.DATE,
//             allowNull: false
//         },

//         revokedAt: {
//             type: DataTypes.DATE,
//             allowNull: true
//         }
//     },
//     {
//         tableName: "TrustedSession",
//         timestamps: true
//     }
// );

// export default TrustedSession;