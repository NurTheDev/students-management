const { z } = require('zod');

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

const emailSchema = z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim();

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password cannot be more than 100 characters long")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    );

const nameSchema = z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot be more than 100 characters long")
    .trim();

const phoneSchema = z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[+]?[\d\s-]+$/, "Invalid phone number format")
    .optional();

const dateSchema = z
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
    .transform((date) => (date ? new Date(date) : null));

const statusSchema = z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Status must be ACTIVE or INACTIVE" }),
});

const inviteStatusSchema = z.enum(["PENDING", "ACCEPTED", "EXPIRED", "REVOKED"], {
    errorMap: () => ({ message: "Status must be PENDING, ACCEPTED, EXPIRED, or REVOKED" }),
});

const sortOrderSchema = z
    .enum(["asc", "desc"])
    .optional()
    .default("desc");

// ==========================================
// Image Schema
// ==========================================

const imageSchema = z.object({
    url: z.string().url("Invalid image URL"),
    public_id: z.string().min(1, "Public ID is required"),
});

module.exports = {
    objectIdSchema,
    emailSchema,
    passwordSchema,
    nameSchema,
    phoneSchema,
    dateSchema,
    statusSchema,
    inviteStatusSchema,
    sortOrderSchema,
    imageSchema,
};