const express = require("express");
const { signUp } = require("../../controllers/authController");
const router = express.Router();

router.route("/sign_up").post(signUp)

module.exports = router;
