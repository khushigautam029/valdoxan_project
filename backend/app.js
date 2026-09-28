import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import accessCodeRoutes from "./routes/accessCodeRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { generalLimiter } from "./utils/rateLimiter.js";
import { MESSAGES, STATUS_CODES } from "./utils/setConstants.js";

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", generalLimiter);

app.get("/api/health", (req, res) => {
    res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.API_RUNNING
    });
});

app.use("/api/auth", userRoutes);
app.use("/api/access-codes", accessCodeRoutes);
app.use( "/api/devices", deviceRoutes);
app.use( "/api/categories", categoryRoutes);
app.use( "/api/content", contentRoutes);
app.use( "/uploads", express.static("uploads"));
app.use("/api/notifications", notificationRoutes);

// Error middleware should be last
app.use(errorMiddleware);

export default app;