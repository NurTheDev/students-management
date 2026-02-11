const {asyncHandler} = require("../helpers/asyncHandler");
const {success} = require("../helpers/apiResponse");
const userSchema = require("../models/user.model");
const {CustomError} = require("../helpers/customError");
const inviteSchema = require("../models/Invite.model");
const refreshTokenSchema = require("../models/refreshToken.model");
const {welcomeTemplate, passwordResetTemplate} = require("../template/emailTemplate")
const {sendEmail} = require("../utils/sendEmail");
exports.registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, token} = req.body;
    // Check if user already exists
    const existingUser = await userSchema.findOne({email: email.toLowerCase().trim()});
    if (existingUser) {
        throw new CustomError('User with this email already exists', 400);
    }
    // Check if invite token is valid
    const invite = await inviteSchema.findOne({
        email,
        token,
        status: "PENDING",
        expiresAt: {$gt: new Date()}
    }).populate("invitedBy");
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
    const {
        refreshToken,
        token: plainToken
    } = await refreshTokenSchema.createToken(newUser._id, req.ip, req.headers['user-agent']);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_IN_MS),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    });
    res.cookie("refreshToken", plainToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    })
    //send a welcome email to the user
    const emailSubject = "Welcome to our platform!";
    const emailBody = welcomeTemplate({
        name: newUser.name,
        role: newUser.role,
        institute: newUser.institute,
        email: newUser.email
    });
    await sendEmail(newUser.email, emailBody, emailSubject);
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

//Login controller
exports.loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // find user with password for login
    const userWithPassword = await userSchema.findByEmailWithPassword(email);
    if (!userWithPassword) {
        throw new CustomError('Invalid email or password', 400);
    }
    // check user is active
    if (userWithPassword.status !== 'ACTIVE') {
        throw new CustomError('User account is not active', 403);
    }
    // check password
    const isMatch = await userWithPassword.comparePassword(password);
    if (!isMatch) {
        throw new CustomError('Invalid email or password', 400);
    }
    // Generate access token and refresh token
    const accessToken = userWithPassword.getAccessToken();
    const {
        refreshToken,
        token
    } = await refreshTokenSchema.createToken(userWithPassword._id, req.ip, req.headers['user-agent']);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_IN_MS),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    });
    res.cookie("refreshToken", token, {
        httpOnly: true,
        maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    })
    // Send success response
    return success(res, {
        user: {
            id: userWithPassword._id,
            name: userWithPassword.name,
            email: userWithPassword.email,
        },
        accessToken,
        refreshToken: refreshToken.tokenHash
    }, 'User logged in successfully', 200);
})

// Get Refresh token
exports.getRefreshToken = asyncHandler(async (req, res) => {
    const {refreshToken} = req.cookies;
    if (!refreshToken) {
        throw new CustomError('Refresh token not found', 400);
    }
    const activeToken = await refreshTokenSchema.find({
        isRevoked: false,
        expiresAt: {$gt: new Date()}
    }).populate("user");
    let storedToken = null;
    for (const token of activeToken) {
        const isMatch = await token.compareToken(refreshToken);
        if (isMatch) {
            storedToken = token;
            break;
        }
    }
    if (!storedToken || !storedToken.isValid() || !storedToken.user || storedToken.user.status !== 'ACTIVE') {
        throw new CustomError('Invalid or expired refresh token', 400);
    }
    const user = storedToken.user;
    // revoke old token
    await storedToken.revoke(req.ip, "Used for refresh");
    const newAccessToken = user.getAccessToken();
    const {refreshToken: newRefreshToken, token: newPlainToken} = await refreshTokenSchema.createToken(user._id, req.ip, req.headers['user-agent']);
    // link old token with new token for audit
    storedToken.replacedByToken = newRefreshToken._id;
    await storedToken.save();
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_IN_MS),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    });
    res.cookie("refreshToken", newPlainToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    })
    return success(res, {
        accessToken: newAccessToken
    }, 'Access token refreshed successfully', 200);
})
// Logout controller
exports.logoutUser = asyncHandler(async (req, res) => {
    const {refreshToken} = req.cookies;
    if (refreshToken) {
        const activeToken = await refreshTokenSchema.find({
            isRevoked: false,
            expiresAt: {$gt: new Date()}
        }).populate("user");
        for (const token of activeToken) {
            const isMatch = await token.compareToken(refreshToken);
            if (isMatch) {
                await token.revoke(req.ip, "User logged out");
                break;
            }
        }
    }
    res.clearCookie("accessToken", {path: "/"});
    res.clearCookie("refreshToken", {path: "/"});
    return success(res, null, 'User logged out successfully', 200);
})
// Log out all devices controller
exports.logoutAllDevices = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    await refreshTokenSchema.revokeAllTokensForUser(userId, req.ip, "User logged out from all devices");
    res.clearCookie("accessToken", {path: "/"});
    res.clearCookie("refreshToken", {path: "/"});
    return success(res, null, 'User logged out from all devices successfully', 200);
})

// forgot password controller
exports.forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await userSchema.findOne({email: email.toLowerCase().trim(), isDeleted: false});
    if (!user) {
        throw new CustomError('User with this email does not exist', 400);
    }
    const resetToken = user.generateResetPasswordToken();
    await user.save();
    // send email with reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailSubject = "Password Reset Request";
   const emailBody = passwordResetTemplate({
        name: user.name,
        resetLink,
       resetToken
    });
    await sendEmail(user.email, emailBody, emailSubject);
    return success(res, null, 'Password reset link sent to your email', 200);
})
// reset password controller
exports.resetPassword = asyncHandler(async (req, res) => {
    const {token, password, confirmPassword} = req.body;
    const user = await userSchema.findOne({
        resetPasswordTokenHash: token,
        resetPasswordExpires: {$gt: new Date()},
        isDeleted: false
    });
    if (!user) {
        throw new CustomError('Invalid or expired password reset token', 400);
    }
    if (password !== confirmPassword) {
        throw new CustomError('Password and confirm password do not match', 400);
    }
    user.password = password;
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;
    await user.save();
    return success(res, null, 'Password reset successfully', 200);
})
//change password controller
exports.changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const {currentPassword, newPassword, confirmNewPassword} = req.body;
    const user = await userSchema.findById(userId).select('+password');
    if (!user) {
        throw new CustomError('User not found', 404);
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new CustomError('Current password is incorrect', 400);
    }
    if (newPassword !== confirmNewPassword) {
        throw new CustomError('New password and confirm password do not match', 400);
    }
    user.password = newPassword;
    await user.save();
    return success(res, null, 'Password changed successfully', 200);
})
