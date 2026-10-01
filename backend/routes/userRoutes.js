import express from "express";
import {
    changePasswordController,
    deleteAccountController,
    getMeController,
    login,
    logout,
    updateProfileController
} from "../controller/userController.js";
import {
    authenticate
} from "../middleware/authMiddleware.js";
import {
    validate
} from "../middleware/validateMiddleware.js";
import {
    loginLimiter,
} from "../utils/rateLimiter.js";
import {
    changePasswordValidation,
    loginValidation,
    updateProfileValidation,
} from "../validation/userValidation.js";

const router = express.Router();

router.post( "/login", loginLimiter, validate(loginValidation), login);
router.get( "/me", authenticate, getMeController);
router.put( "/profile", authenticate, validate(updateProfileValidation), updateProfileController);
router.put( "/change-password", authenticate, validate(changePasswordValidation), changePasswordController);
router.post( "/logout", authenticate, logout);
router.delete( "/account", authenticate, deleteAccountController);

export default router;