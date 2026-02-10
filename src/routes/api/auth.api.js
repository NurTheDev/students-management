const express = require("express");
const { registerUser, loginUser, getRefreshToken } = require("../../controllers/userController");
const router = express.Router();
const { createUserSchema } = require("../../validators/userValidation");
const { validate } = require("../../middlewares/validate");
const {loginSchema} = require("../../validators/auth.validator");
router.route("/register-via-invite").post(validate(createUserSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/refresh-token").post(getRefreshToken);

module.exports = router;
