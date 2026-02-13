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
// controller to handle invite acceptance
exports.acceptInvite = asyncHandler(async (req, res)=>{
    const { token, email } = req.body;
    // Find the invite by token and email
    const invite = await inviteSchema.findOne({ token, email: email.toLowerCase().trim(), status: "PENDING" });
    if (!invite) {
        throw new CustomError("Invalid or expired invite token.", 400);
    }
    // Check if the invite has expired
    if (invite.expiresAt < new Date()) {
        throw new CustomError("This invite has expired.", 400);
    }
    // Mark the invite as accepted
    invite.status = "ACCEPTED";
    await invite.save();
    return success(res, null, "Invite accepted successfully", 200);
})
// controller to get all invites (Admin only)
exports.getAllInvites = asyncHandler(async (req, res)=>{
    const invites = await inviteSchema.find().populate("invitedBy", "name email");
    return success(res, { invites }, "Invites fetched successfully", 200);
})
// controller to delete an invite (Admin only)
exports.deleteInvite = asyncHandler(async (req, res)=>{
    const { id } = req.params;
    const invite = await inviteSchema.findById(id);
    if (!invite) {
        throw new CustomError("Invite not found", 404);
    }
    await invite.remove();
    return success(res, null, "Invite deleted successfully", 200);
})
// controller to resend an invite (Admin only)
exports.resendInvite = asyncHandler(async (req, res)=>{
    const { id } = req.params;
    const invite = await inviteSchema.findById(id);
    if (!invite) {
        throw new CustomError("Invite not found", 404);
    }
    if (invite.status !== "PENDING") {
        throw new CustomError("Only pending invites can be resent", 400);
    }
    // send email to the invited user with the token
    const inviteLink = `http://localhost:3000/accept-invite?token=${invite.token}&email=${invite.email}`;
    const emailSubject = "Your Invite is Resent!";
    const response = emailBody({name: invite.email, role: invite.role, invitedBy: invite.invitedBy.name,institute: "Our Platform", inviteLink, expiresAt: invite.expiresAt, token: invite.token});
    await sendEmail(invite.email, response, emailSubject);
    return success(res, null, "Invite resent successfully", 200);
})
