const { z } = require("zod");
const signUpSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    name: z.string().min(3, "Name is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),

    email: z.string().email("Invalid email address").optional(),
    phone: z.string().min(10, "Phone number must be at least 10 digits long").optional(),

    bio: z.string().max(160).optional(),

    dateOfBirth: z
        .string()
        .optional()
        .refine(date => {
            if (!date) return true;
            const d = new Date(date);
            return !isNaN(d.getTime());
        }, "Invalid date format")
        .transform(date => date ? new Date(date) : undefined),

    institute: z.string().max(100).optional(),
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    zipCode: z.string().max(20).optional(),

    role: z.string().optional(),
    isActive: z.boolean().optional(),
}).refine(
    data => data.email || data.phone,
    {
        message: "Either email or phone must be provided",
        path: ["email"],
    }
);

module.exports = { signUpSchema };
