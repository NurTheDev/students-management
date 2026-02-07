const { asyncHandler } = require("../helpers/asyncHandler");
const { success } = require("../helpers/apiResponse");
const userSchema = require("../models/user.model");
const { CustomError } = require("../helpers/customError");
const inviteSchema = require("../models/Invite.model");
const refreshTokenSchema = require("../models/refreshToken.model");
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, token } = req.body;
    // Check if user already exists
    const existingUser = await userSchema.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
        throw new CustomError('User with this email already exists', 400);
    }
    // Check if invite token is valid
    const invite = await inviteSchema.findOne({email, token, status: "PENDING", expiresAt: { $gt: new Date() } }).populate("invitedBy");
    if (!invite) {
        throw new CustomError('Invalid or expired invite token', 400);
    }
    // Create user with ALL required fields
    const newUser = await userSchema.create({
        name,
        email: invite.email,
        password,
        role: invite.role,
        institute: invite.institute,
        invitedBy: invite.invitedBy,
        invitedAt: invite.createdAt,
        emailVerified: true,
        status: 'ACTIVE',
    });
    // Mark invite as accepted
    await inviteSchema.markAsAccepted(token, newUser._id);
    const accessToken = newUser.getAccessToken();
    const {refreshToken} = await refreshTokenSchema.createToken(newUser._id, req.ip, req.headers['user-agent']);
    console.log(refreshToken)
    // Send success response
    return success(res, {
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        },
        invitedBy: {
            id: invite.invitedBy._id,
            name: invite.invitedBy.name,
            email: invite.invitedBy.email,
        },
        accessToken,
        refreshToken: refreshToken.tokenHash
    }, 'User registered successfully', 201);
})
