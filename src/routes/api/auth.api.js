const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getRefreshToken,
    logoutUser,
    logoutAllDevices,
    forgotPassword,
    resetPassword,
    changePassword
} = require("../../controllers/auth.controller");
const {validate} = require("../../middlewares/validate");
const {createUserSchema} = require("../../validators/userValidation");
const {
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
} = require("../../validators/auth.validator");
const {authGard, authorize} = require("../../middlewares/Authorization");

router.post("/register-via-invite", validate(createUserSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh-token", getRefreshToken);
router.post("/logout", authGard, logoutUser);
router.post("/logout-all-devices", authGard, logoutAllDevices);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/change-password", authGard, authorize("USER"), validate(changePasswordSchema), changePassword);

module.exports = router;