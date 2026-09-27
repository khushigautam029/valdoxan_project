import express from "express";

import {
    getByAccessCode,
    getById,
    getStats
} from "../controller/deviceController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();


// All device APIs require authentication
router.use(authenticate);


// Devices belonging to an access code
router.get(
    "/access-code/:accessCodeId",
    getByAccessCode
);


// Device statistics for an access code
router.get(
    "/access-code/:accessCodeId/stats",
    getStats
);


// Get one device
router.get(
    "/:id",
    getById
);


export default router;