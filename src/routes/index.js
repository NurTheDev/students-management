const express = require("express");
const router = express.Router();
const inviteRouter = require("./api/invite.api");
const authRouter = require("./api/auth.api");

router.use("/auth", authRouter);
router.use("/invites", inviteRouter);

module.exports = router;
