const { z } = require('zod');
const {
    emailSchema,
    passwordSchema,
    nameSchema,
    phoneSchema,
    dateSchema,
} = require('./common.validator');

// ==========================================
// Login
// ==========================================

const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
});

// ==========================================
// Register via Invite
// ==========================================

const registerViaInviteSchema = z
    .object({
        token: z.string().length(64, "Invalid invite token format"),
        name: nameSchema,
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Please confirm your password"),
        phone: phoneSchema,
        dateOfBirth: dateSchema,
        bio: z
            .string()
            .max(500, "Bio cannot exceed 500 characters")
            .trim()
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

// ==========================================
// Forgot Password
// ==========================================

const forgotPasswordSchema = z.object({
    email: emailSchema,
});

// ==========================================
// Reset Password
// ==========================================

const resetPasswordSchema = z
    .object({
        token: z.string().min(1, "Reset token is required"),
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

// ==========================================
// Change Password
// ==========================================

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: passwordSchema,
        confirmNewPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from current password",
        path: ["newPassword"],
    });

// ==========================================
// Refresh Token
// ==========================================

const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});

// ==========================================
// Verify Email
// ==========================================

const verifyEmailSchema = z.object({
    token: z.string().min(1, "Verification token is required"),
});

module.exports = {
    loginSchema,
    registerViaInviteSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    refreshTokenSchema,
    verifyEmailSchema,
};