import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";

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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use("/api", limiter);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running"
    });
});

app.use("/api/auth", userRoutes);
// Error middleware should be last
app.use(errorMiddleware);

export default app;