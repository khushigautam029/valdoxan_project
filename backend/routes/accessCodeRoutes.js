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
router.use(authenticate);

router.post("/",validate(createAccessCodeValidation), create);
router.get( "/", getAll);
router.get( "/:id/device-stats", getStats);
router.get("/:id/devices",getDevices);
router.get( "/:id", getById);
router.put( "/:id", validate(updateAccessCodeValidation), update);
router.delete( "/:id", remove);

export default router;