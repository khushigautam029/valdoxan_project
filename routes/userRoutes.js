import express from "express";
import {
    login,
    register
} from "../controller/userController.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
    loginValidation,
    registerValidation
} from "../validation/userValidation.js";

const router = express.Router();

router.post(
    "/register",
    validate(registerValidation),
    register
);
router.post(
    "/login",
    validate(loginValidation),
    login
);

export default router;