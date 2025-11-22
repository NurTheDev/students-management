const express = require("express");
const { signUp, verifyAccount, resendVerificationCode } = require("../../controllers/authController");
const router = express.Router();
const { validate } = require("../../middlewares/validate");
const { signUpSchema } = require("../../validation/userValidation");

router.route("/sign_up").post(validate(signUpSchema), signUp);
router.route("/verify_account").post(verifyAccount);
router.route("/resend_verification").post(resendVerificationCode);

module.exports = router;
