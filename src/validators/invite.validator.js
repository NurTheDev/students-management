const { z } = require('zod');
const {
    objectIdSchema,
    emailSchema,
} = require('./common.validator');

// ==========================================
// Create Single Invite
// ==========================================
const createInviteSchema = z.object({
    email: emailSchema,
    message: z
        .string()
        .max(500, "Message cannot exceed 500 characters")
        .trim()
        .optional()
        .nullable(),
    expiryHours: z
        .number()
        .int("Expiry hours must be an integer")
        .min(1, "Expiry must be at least 1 hour")
        .max(168, "Expiry cannot exceed 168 hours (7 days)")
        .optional()
        .default(48),
    token : z.string().length(64).optional(),
    invitedBy: objectIdSchema
});

// ==========================================
// Verify Invite Token
// ==========================================

const verifyInviteTokenSchema = z.object({
    token: z.string().length(64, "Invalid token format"),
});

// ==========================================
// Revoke Invite
// ==========================================

const revokeInviteSchema = z.object({
    reason: z
        .string()
        .max(200, "Reason cannot exceed 200 characters")
        .trim()
        .optional()
        .nullable(),
});

// ==========================================
// Resend Invite
// ==========================================

const resendInviteSchema = z.object({
    expiryHours: z
        .number()
        .int()
        .min(1, "Expiry must be at least 1 hour")
        .max(168, "Expiry cannot exceed 168 hours")
        .optional()
        .default(48),
});

// ==========================================
// Param Schemas
// ==========================================

const inviteIdParamSchema = z.object({
    id: objectIdSchema,
});

const inviteTokenParamSchema = z.object({
    token: z.string().length(64, "Invalid token format"),
});

module.exports = {
    createInviteSchema,
    verifyInviteTokenSchema,
    revokeInviteSchema,
    resendInviteSchema,
    inviteIdParamSchema,
    inviteTokenParamSchema,
};