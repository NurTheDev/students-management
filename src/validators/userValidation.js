const { z } = require('zod');
const {
    objectIdSchema,
    emailSchema,
    passwordSchema,
    nameSchema,
    phoneSchema,
    dateSchema,
    paginationSchema,
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
    role: userRoleSchema,
    phone: phoneSchema,
    bio: z
        .string()
        .max(500, "Bio cannot exceed 500 characters")
        .trim()
        .optional(),
    dateOfBirth: dateSchema,
    institute: objectIdSchema,
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
// Get Users Query (Admin)
// ==========================================

const getUsersQuerySchema = paginationSchema.extend({
    role: userRoleSchema.optional(),
    status: statusSchema.optional(),
    institute: objectIdSchema.optional(),
    emailVerified: z
        .string()
        .optional()
        .transform((val) => {
            if (val === "true") return true;
            if (val === "false") return false;
            return undefined;
        }),
    sortBy: z
        .enum(["createdAt", "name", "email", "role", "status", "lastLoginAt"])
        .optional()
        .default("createdAt"),
    sortOrder: z
        .enum(["asc", "desc"])
        .optional()
        .default("desc"),
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
    getUsersQuerySchema,
    userIdParamSchema,
};