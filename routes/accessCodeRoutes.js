import express from "express";

import {
    create,
    getAll,
    getById,
    getDevices,
    getStats,
    remove,
    update
} from "../controller/accessCodeController.js";

import { authenticate } from "../middleware/authMiddleware.js";

import { validate } from "../middleware/validateMiddleware.js";

import {
    createAccessCodeValidation,
    updateAccessCodeValidation
} from "../validation/accessCodeValidation.js";


const router = express.Router();


// All access-code APIs require admin authentication
router.use(authenticate);


// Create
router.post(
    "/",
    validate(createAccessCodeValidation),
    create
);


// List + search
router.get(
    "/",
    getAll
);


// Device statistics
router.get(
    "/:id/device-stats",
    getStats
);


// Devices belonging to access code
router.get(
    "/:id/devices",
    getDevices
);


// Get single access code
router.get(
    "/:id",
    getById
);


// Update
router.put(
    "/:id",
    validate(updateAccessCodeValidation),
    update
);


// Remove/deactivate
router.delete(
    "/:id",
    remove
);


export default router;