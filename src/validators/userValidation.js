const { z } = require('zod');
const {
    objectIdSchema,
    emailSchema,
    passwordSchema,
    nameSchema,
    phoneSchema,
    dateSchema,
    userRoleSchema,
    statusSchema,
} = require('./common.validator');

// ==========================================
// Create User (Admin)
// ==========================================

const createUserSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    phone: phoneSchema,
    bio: z
        .string()
        .max(500, "Bio cannot exceed 500 characters")
        .trim()
        .optional(),
    dateOfBirth: dateSchema,
    token: z.string().optional(),
});

// ==========================================
// Update User Profile (Self)
// ==========================================

const updateProfileSchema = z.object({
    name: nameSchema.optional(),
    phone: phoneSchema,
    bio: z
        .string()
        .max(500, "Bio cannot exceed 500 characters")
        .trim()
        .optional()
        .nullable(),
    dateOfBirth: dateSchema,
});

// ==========================================
// Update User (Admin)
// ==========================================

const updateUserSchema = z.object({
    name: nameSchema.optional(),
    phone: phoneSchema,
    bio: z
        .string()
        .max(500, "Bio cannot exceed 500 characters")
        .trim()
        .optional()
        .nullable(),
    dateOfBirth: dateSchema,
    emailVerified: z.boolean().optional(),
});

// ==========================================
// Update User Role (Admin)
// ==========================================

const updateUserRoleSchema = z.object({
    role: userRoleSchema,
});

// ==========================================
// Update User Status (Admin)
// ==========================================

const updateUserStatusSchema = z.object({
    status: statusSchema,
});

// ==========================================
// Param Schemas
// ==========================================

const userIdParamSchema = z.object({
    id: objectIdSchema,
});

module.exports = {
    createUserSchema,
    updateProfileSchema,
    updateUserSchema,
    updateUserRoleSchema,
    updateUserStatusSchema,
    userIdParamSchema,
};