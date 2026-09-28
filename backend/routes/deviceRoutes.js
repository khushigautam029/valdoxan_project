import express from "express";
import {
    getByAccessCode,
    getById,
    getStats
} from "../controller/deviceController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);
router.get( "/access-code/:accessCodeId", getByAccessCode);
router.get( "/access-code/:accessCodeId/stats", getStats);
router.get( "/:id", getById);

export default router;