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

router.use(authenticate);
router.get( "/access-code/:accessCodeId", getByAccessCode);
router.get( "/access-code/:accessCodeId/stats", getStats);
router.get( "/:id", getById);
router.post( "/register", validate(registerDeviceSchema), registerDeviceController );

export default router;