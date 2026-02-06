const { z } = require('zod');
const {
    objectIdSchema,
    emailSchema,
    paginationSchema,
    userRoleSchema,
    inviteStatusSchema,
} = require('./common.validator');

// ==========================================
// Create Single Invite
// ==========================================
const createInviteSchema = z.object({
    email: emailSchema,
    role: userRoleSchema.optional().default("STUDENT"),
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
// Bulk Create Invites
// ==========================================

const bulkInviteItemSchema = z.object({
    email: emailSchema,
    role: userRoleSchema.optional().default("STUDENT"),
    metadata: z
        .object({
            name: z.string().trim().optional().nullable(),
            phone: z.string().trim().optional().nullable(),
        })
        .optional(),
});

const bulkCreateInvitesSchema = z.object({
    invites: z
        .array(bulkInviteItemSchema)
        .min(1, "At least one invite is required")
        .max(50, "Cannot send more than 50 invites at once"),
    message: z
        .string()
        .max(500, "Message cannot exceed 500 characters")
        .trim()
        .optional()
        .nullable(),
    expiryHours: z
        .number()
        .int()
        .min(1)
        .max(168)
        .optional()
        .default(48),
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
    bulkCreateInvitesSchema,
    bulkInviteItemSchema,
    verifyInviteTokenSchema,
    revokeInviteSchema,
    resendInviteSchema,
    inviteIdParamSchema,
    inviteTokenParamSchema,
};