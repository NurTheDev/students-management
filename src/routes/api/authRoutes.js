const express = require("express");
const { signUp } = require("../../controllers/authController");
const router = express.Router();
const { validate } = require("../../middlewares/validate");
const { signUpSchema } = require("../../validation/userValidation");

router.route("/sign_up").post(validate(signUpSchema), signUp);

module.exports = router;
