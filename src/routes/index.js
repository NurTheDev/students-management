const express = require("express");
const router = express.Router();
const inviteRouter = require("./api/invite.api");
const authRouter = require("./api/auth.api");
const userRouter = require("./api/user.api");
const classroomRouter = require("./api/classroom.api");
router.use("/classrooms", classroomRouter);
router.use("/auth", authRouter);
router.use("/invites", inviteRouter);
router.use("/user", userRouter)

module.exports = router;
