import express from "express";

import {
    create,
    getAll,
    getById,
    remove,
    update
} from "../controller/categoryController.js";

import { authenticate } from "../middleware/authMiddleware.js";

import { validate } from "../middleware/validateMiddleware.js";

import {
    createCategoryValidation,
    updateCategoryValidation
} from "../validation/categoryValidation.js";


const router = express.Router();


// All category APIs require admin authentication
router.use(authenticate);


// Create category
router.post(
    "/",
    validate(createCategoryValidation),
    create
);


// Get categories / search categories
router.get(
    "/",
    getAll
);


// Get category by ID
router.get(
    "/:id",
    getById
);


// Update category
router.put(
    "/:id",
    validate(updateCategoryValidation),
    update
);


// Remove/deactivate category
router.delete(
    "/:id",
    remove
);


export default router;