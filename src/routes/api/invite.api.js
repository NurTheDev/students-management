const express = require('express');
const router = express.Router();
const {createInviteSchema} = require('../../validators/invite.validator');
const {
    sendInvite,
    acceptInvite,
    resendInvite,
    deleteInvite,
    getAllInvites
} = require('../../controllers/invite.controller');
const {validate} = require('../../middlewares/validate');
const {authGard, authorize} = require('../../middlewares/Authorization');

router.use(authGard);
router.route('/send-invite').post(authorize(), validate(createInviteSchema), sendInvite);
router.route('/accept-invite/:id').post(acceptInvite);
router.route('/resend-invite/:id').post(authorize(), resendInvite);
router.route('/delete-invite/:id').delete(authorize(), deleteInvite);
router.route('/get-all-invites').get(authorize(), getAllInvites);


module.exports = router;