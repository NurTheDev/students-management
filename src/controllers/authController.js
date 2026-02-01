const {asyncHandler} = require("../helpers/asyncHandler");
const {success} = require("../helpers/apiResponse");
const {CustomError} = require("../helpers/customError");
const userSchema = require("../models/user.model");
const {otpGenerator} = require("../utils/otpGenerator");
const emailTemplate = require("../template/verifiyEmail");
const {sendEmail} = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

/**
 * Handle user sign\-up and send verification via email or SMS
 * @route POST /api/v1/auth/sign_up
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.signUp = asyncHandler(async (req, res) => {
    const createUser = await userSchema.create(req.body);
    if (!createUser) throw new CustomError("User already exists", 400);
    const {otp, expiry} = otpGenerator();
    if (req.body.email) {
        const verifyLink = `${process.env.FRONTEND_URL}/verify-email?email=${createUser?.email}&code=${otp}`;
        const htmlTemplate = emailTemplate({
            name: createUser?.name,
            otp: otp,
            companyName: process.env.COMPANY_NAME,
            verifyLink: verifyLink,
            expiresIn: expiry
        });
        // send email
        await sendEmail(createUser?.email, htmlTemplate, "Verify your email");
        createUser.emailVerificationToken = otp;
        createUser.emailVerificationTokenExpiry = expiry;
        await createUser.save();
    } else if (req.body.phone) {
        const smsTemplate = `Your ${process.env.COMPANY_NAME} verification code is ${otp}. It will expire in 2 minutes.`;
        // send SMS
        await sendSMS(createUser?.phone, smsTemplate);
        createUser.phoneVerificationToken = otp;
        createUser.phoneVerificationTokenExpiry = expiry;
        await createUser.save();
    }
    success(res, createUser, "User created successfully with email. Please verify your email.", 201);
})

/**
 * Verify user account via email or SMS code
 * @route POST /api/v1/auth/verify_account
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.verifyAccount = asyncHandler(async (req, res) => {
    const {email, phone, code} = req.body;
    let user;
    if (email) {
        user = await userSchema.findOne({email: email});
        if (!user) throw new CustomError("User not found", 404);
        if (user.emailVerificationToken !== code) throw new CustomError("Invalid verification code", 400);
        if (user.emailVerificationTokenExpiry < Date.now()) throw new CustomError("Verification code expired", 400);
        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationTokenExpiry = null;
        await user.save();
        success(res, null, "Email verified successfully", 200);
    } else if (phone) {
        user = await userSchema.findOne({phone: phone});
        if (!user) throw new CustomError("User not found", 404);
        if (user.phoneVerificationToken !== code) throw new CustomError("Invalid verification code", 400);
        if (user.phoneVerificationTokenExpiry < Date.now()) throw new CustomError("Verification code expired", 400);
        user.phoneVerified = true;
        user.phoneVerificationToken = null;
        user.phoneVerificationTokenExpiry = null;
        await user.save();
        success(res, null, "Phone number verified successfully", 200);
    } else {
        throw new CustomError("Email or phone number is required", 400);
    }
})

/**
 * Resend verification code via email or SMS
 * @route POST /api/v1/auth/resend_verification
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.resendVerificationCode = asyncHandler(async (req, res) => {
    const {email, phone} = req.body;
    if (!email && !phone) throw new CustomError("User not found", 404);
    let user;
    const {otp, expiry} = otpGenerator();
    if (email) {
        user = await userSchema.findOne({email: email});
        if (!user) throw new CustomError("User not found", 404);
        const verifyLink = `${process.env.FRONTEND_URL}/verify-email?email=${user?.email}&code=${otp}`;
        const htmlTemplate = emailTemplate({
            name: user?.name,
            otp: otp,
            companyName: process.env.COMPANY_NAME,
            verifyLink: verifyLink,
            expiresIn: expiry
        });
        // send email
        await sendEmail(user?.email, htmlTemplate, "Verify your email");
        user.emailVerificationToken = otp;
        user.emailVerificationTokenExpiry = expiry;
        await user.save();
        success(res, null, "Verification email sent successfully", 200);
    } else if (phone) {
        user = await userSchema.findOne({phone: phone});
        if (!user) throw new CustomError("User not found", 404);
        const smsTemplate = `Your ${process.env.COMPANY_NAME} verification code is ${otp}. It will expire in 2 minutes.`;
        // send SMS
        await sendSMS(user?.phone, smsTemplate);
        user.phoneVerificationToken = otp;
        user.phoneVerificationTokenExpiry = expiry;
        await user.save();
        success(res, null, "Verification SMS sent successfully", 200);
    }
})

exports.uploadAvatar = asyncHandler(async (req, res) => {
    
})