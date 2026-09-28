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
router.use(authenticate);

router.post( "/", validate(createCategoryValidation), create);
router.get( "/", getAll);
router.get( "/:id", getById);
router.put("/:id", validate(updateCategoryValidation),update);
router.delete( "/:id", remove);

export default router;