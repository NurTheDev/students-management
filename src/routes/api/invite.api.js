const express = require('express');
const router = express.Router();
const {createInviteSchema} = require('../../validators/invite.validator');
const {sendInvite, acceptInvite} = require('../../controllers/invite.controller');
const {validate} = require('../../middlewares/validate');

router.route('/send-invite').post(validate(createInviteSchema), sendInvite);
// router.route('/accept').post(acceptInvite);

module.exports = router;