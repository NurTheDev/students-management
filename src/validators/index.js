const {z} = require('zod');

// ==========================================
// Common Reusable Schemas
// ==========================================
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

const emailSchema = z.string().email("Invalid email address").toLowerCase().trim();
const passwordSchema = z.string().min(8, "Password must be at least 8 characters long").max(100, "password cannot be" +
    " more than 100 characters long").regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number");
const nameSchema = z.string().min(2, "Name must be at least 2 characters long").max(100, "Name cannot be more than 100 characters long").trim();
const phoneSchema = z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[+]?[\d\s-]+$/, "Invalid phone number format")
    .optional();

// ==========================================
// Auth Validation Schemas
// ==========================================

const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
});
const registerViaInviteSchema = z
    .object({
        token: z
            .string()
            .length(64, "Invalid invite token format"),
        name: nameSchema,
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
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
// User Validation Schemas
// ==========================================

const createUserSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(["ADMIN", "MANAGER", "STAFF"], {
        errorMap: () => ({ message: "Role must be ADMIN, MANAGER, or STAFF" }),
    }),
    phone: phoneSchema,
    bio: z
        .string()
        .max(500, "Bio cannot exceed 500 characters")
        .optional(),
    dateOfBirth: z
        .string()
        .optional()
        .refine(
            (date) => {
                if (!date) return true;
                const d = new Date(date);
                return !isNaN(d.getTime());
            },
            { message: "Invalid date format" }
        )
        .transform((date) => (date ? new Date(date) : undefined)),
    institute: objectIdSchema,
});

const updateUserSchema = z.object({
    name: nameSchema.optional(),
    phone: phoneSchema,
    bio: z
        .string()
        .max(500, "Bio cannot exceed 500 characters")
        .optional(),
    dateOfBirth: z
        .string()
        .optional()
        .nullable()
        .refine(
            (date) => {
                if (!date) return true;
                const d = new Date(date);
                return !isNaN(d.getTime());
            },
            { message: "Invalid date format" }
        )
        .transform((date) => (date ? new Date(date) : undefined)),
});

const updateUserRoleSchema = z.object({
    role: z.enum(["ADMIN", "MANAGER", "STAFF"], {
        errorMap: () => ({ message: "Role must be ADMIN, MANAGER, or STAFF" }),
    }),
});

const updateUserStatusSchema = z.object({
    status: z.enum(["ACTIVE", "INACTIVE"], {
        errorMap: () => ({ message: "Status must be ACTIVE or INACTIVE" }),
    }),
});

const getUsersQuerySchema = paginationSchema.extend({
    role: z
        .enum(["ADMIN", "MANAGER", "STAFF"])
        .optional(),
    status: z
        .enum(["ACTIVE", "INACTIVE"])
        .optional(),
    sortBy: z
        .enum(["createdAt", "name", "email", "role", "status"])
        .optional()
        .default("createdAt"),
    sortOrder: z
        .enum(["asc", "desc"])
        .optional()
        .default("desc"),
});

const userIdParamSchema = z.object({
    id: objectIdSchema,
});

module.exports = {
    // Auth Schemas
    loginSchema,
    registerViaInviteSchema,
    resetPasswordSchema,
    changePasswordSchema,
    // User Schemas
    createUserSchema,
    updateUserSchema,
    updateUserRoleSchema,
    updateUserStatusSchema,
    getUsersQuerySchema,
    userIdParamSchema,
    // Common Schemas
    objectIdSchema,
    emailSchema,
    passwordSchema,
    nameSchema,
    phoneSchema,
};