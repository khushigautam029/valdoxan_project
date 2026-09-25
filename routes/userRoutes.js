import express from "express";

import { login } from "../controller/userController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { loginValidation } from "../validation/userValidation.js";

const router = express.Router();

router.post(
    "/login",
    validate(loginValidation),
    login
);

export default router;