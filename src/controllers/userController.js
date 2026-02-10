const {asyncHandler} = require("../helpers/asyncHandler");
const {success} = require("../helpers/apiResponse");
const userSchema = require("../models/user.model");
const {CustomError} = require("../helpers/customError");
const inviteSchema = require("../models/Invite.model");
const refreshTokenSchema = require("../models/refreshToken.model");
const {welcomeTemplate} = require("../template/emailTemplate")
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
    const {refreshToken} = await refreshTokenSchema.createToken(newUser._id, req.ip, req.headers['user-agent']);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_IN_MS),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    });
    res.cookie("refreshToken", refreshToken.tokenHash, {
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
    const {refreshToken} = await refreshTokenSchema.createToken(userWithPassword._id, req.ip, req.headers['user-agent']);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_IN_MS),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    });
    res.cookie("refreshToken", refreshToken.tokenHash, {
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
    const storedToken = await refreshTokenSchema.findOne({tokenHash: refreshToken}).populate("user");
    if (!storedToken || !storedToken.isValid()) {
        throw new CustomError('Invalid or expired refresh token', 400);
    }
    const user = storedToken.user;
    const newAccessToken = user.getAccessToken();
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_IN_MS),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    });
    return success(res, {
        accessToken: newAccessToken
    }, 'Access token refreshed successfully', 200);
})
