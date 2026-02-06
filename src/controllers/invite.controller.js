const { asyncHandler } = require("../helpers/asyncHandler");
const { success } = require("../helpers/apiResponse");
const { CustomError } = require("../helpers/customError");
const inviteSchema = require("../models/Invite.model");
const {getToken} = require("../helpers/tokenHelper.js");
const {sendEmail} = require("../utils/sendEmail");
const {inviteTemplate: emailBody} = require("../template/emailTemplate");
// controller to handle invite acceptance
exports.sendInvite = asyncHandler(async (req, res)=>{
    const { email, role, invitedBy, name, institute } = req.body;
    // Check if an invite already exists for the email and is still pending
    const existingInvite = await inviteSchema.findOne({ email: email.toLowerCase().trim(), status: "PENDING" });
    if (existingInvite) {
        throw new CustomError("An invite has already been sent to this email and is still pending.", 400);
    }
    // Create a new invite
    const token = getToken(36);
    const expiresAt = new Date(Date.now() + 7*24*60*60*1000); // Expires in 7 days
    const newInvite = await inviteSchema.create({
        email: email.toLowerCase().trim(),
        role,
        token,
        expiresAt,
        invitedBy
    });
    // send email to the invited user with the token
    const inviteLink = `http://localhost:3000/accept-invite?token=${token}&email=${email}`;
    const emailSubject = "You're Invited!";
    const response = emailBody({name, role, invitedBy,institute, inviteLink, expiresAt, token});
    await sendEmail(email, response, emailSubject);
    return success(res, { invite: newInvite }, "Invite sent successfully", 201,  );
})