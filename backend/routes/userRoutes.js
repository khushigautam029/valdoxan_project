import express from "express";

import {
    get,
    login,
    register
} from "../controller/userController.js";

import { authenticate } from "../middleware/authMiddleware.js";

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

router.get(
    "/me",
    authenticate,
    get
);

export default router;