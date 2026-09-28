import express from "express";
import {
    getMeController,
    login,
    verifyOtp
} from "../controller/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
    loginValidation,
    verifyOtpValidation
} from "../validation/userValidation.js";

const router = express.Router();

router.post("/login", validate(loginValidation),login);
router.post( "/verify-otp", validate(verifyOtpValidation), verifyOtp);
router.get("/me", authenticate, getMeController);

export default router;