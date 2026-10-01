import dotenv from "dotenv";
import { DataTypes } from "sequelize";

dotenv.config();

import app from "./app.js";
import sequelize from "./config/database.js";
import "./models/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();

        console.log("----------------------------------");
        console.log("✅ MySQL Connected Successfully");

        await sequelize.sync();

        const userColumns = await sequelize.getQueryInterface().describeTable("User");
        if (!userColumns.tokenVersion) {
            await sequelize.getQueryInterface().addColumn("User", "tokenVersion", {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            });
        }

        console.log("✅ Database Synced");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server Startup Error:", error);
        process.exit(1);
    }
};

startServer();
