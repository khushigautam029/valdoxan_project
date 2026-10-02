import express from "express";
import {
    getByAccessCode,
    getById,
    getStats,
    registerDeviceController
} from "../controller/deviceController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { registerDeviceSchema } from "../validation/deviceValidation.js";
const router = express.Router();

router.get( "/access-code/:accessCodeId", getByAccessCode);
router.get( "/access-code/:accessCodeId/stats", authenticate, getStats);
router.get( "/:id", authenticate, getById);
router.post( "/register", validate(registerDeviceSchema), registerDeviceController );

export default router;