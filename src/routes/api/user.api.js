const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const {authGard, authorize} = require("../../middlewares/Authorization");
const upload = require("../../middlewares/multer");
router.route("/profile").get(authGard, userController.getProfile);
router.route("/update-profile").patch(authGard, userController.updateProfile);
router.route("/delete-account").delete(authGard,authorize(), userController.deleteProfile);
router.route("/restore-account").post(authGard,authorize(), userController.deleteProfile);
router.route("/get-deleted-accounts").get(authGard, authorize(), userController.getDeletedUser);
router.route("/update-role/:id").patch(authGard, userController.updateRole);
router.route("/update-user-profile-image").patch(authGard, upload.fields([{name: 'image', maxCount: 1}]), userController.updateProfileImage);

module.exports = router;