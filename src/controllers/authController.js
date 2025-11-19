const {asyncHandler} = require("../helpers/asyncHandler");
const {success} = require("../helpers/apiResponse");
const {CustomError} = require("../helpers/customError");
const userSchema = require("../models/User");
const {otpGenerator} = require("../utils/otpGenerator");
const emailTemplate = require("../template/verifiyEmail");
const {sendEmail} = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");
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
