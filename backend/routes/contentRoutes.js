import express from "express";
import {
    create,
    getAll,
    getById,
    reorder,
    update,
    updateStatus
} from "../controller/contentController.js";
import {
    uploadImage
} from "../controller/contentUploadController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
    contentStatusValidation,
    createContentValidation,
    reorderContentValidation,
    updateContentValidation
} from "../validation/contentValidation.js";

const router = express.Router();
router.use(authenticate);

router.get( "/", getAll);
router.post( "/upload-image", upload.single("image"), uploadImage);
router.patch( "/reorder", validate(reorderContentValidation), reorder);
router.patch("/:id/status", validate(contentStatusValidation), updateStatus);
router.get( "/:id", getById);
router.post( "/", validate(createContentValidation), create);
router.put( "/:id", validate(updateContentValidation), update);

export default router;