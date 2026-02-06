const express = require("express");
const router = express.Router();

// mount api sub-routers (these are under src/routes/api)
// const userRouter = require("./api/userRoutes");
// const authRouter = require("./api/authRoutes");
const inviteRouter = require("./api/invite.api");
// router.use("/users", userRouter);
// router.use("/auth", authRouter);
router.use("/invites", inviteRouter);

module.exports = router;
