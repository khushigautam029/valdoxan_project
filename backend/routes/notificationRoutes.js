import express from "express";
import {
    create,
    getAll,
    getById,
    remove,
    send,
    update,
    updateStatus
} from "../controller/notificationController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
    createNotificationValidation,
    notificationStatusValidation,
    updateNotificationValidation
} from "../validation/notificationValidation.js";

const router = express.Router();
router.use(authenticate);

router.post( "/", validate(createNotificationValidation), create);
router.get( "/", getAll);
router.get( "/:id", getById);
router.put( "/:id", validate(updateNotificationValidation), update);
router.delete( "/:id", remove);
router.patch( "/:id/status", validate(notificationStatusValidation), updateStatus);
router.post( "/:id/send", send);

export default router;