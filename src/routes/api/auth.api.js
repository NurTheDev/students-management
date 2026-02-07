const express = require("express");
const { registerUser } = require("../../controllers/userController");
const router = express.Router();
const { createUserSchema } = require("../../validators/userValidation");
const { validate } = require("../../middlewares/validate");
router.route("/register-via-invite").post(validate(createUserSchema), registerUser);

module.exports = router;
