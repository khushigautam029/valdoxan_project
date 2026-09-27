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

import { validate } from "../middleware/validateMiddleware.js";

import {
    contentStatusValidation,
    createContentValidation,
    reorderContentValidation,
    updateContentValidation
} from "../validation/contentValidation.js";

import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();


router.use(authenticate);


// Get all content + filters
router.get(
    "/",
    getAll
);


// Upload image
router.post(
    "/upload-image",
    upload.single("image"),
    uploadImage
);


// Reorder content
router.patch(
    "/reorder",
    validate(reorderContentValidation),
    reorder
);


// Quick publish / unpublish
router.patch(
    "/:id/status",
    validate(contentStatusValidation),
    updateStatus
);


// Get content by ID
router.get(
    "/:id",
    getById
);


// Create content
router.post(
    "/",
    validate(createContentValidation),
    create
);


// Update content
router.put(
    "/:id",
    validate(updateContentValidation),
    update
);


export default router;