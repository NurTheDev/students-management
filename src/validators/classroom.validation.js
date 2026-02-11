const { z } = require('zod');
const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');
const nameSchema = z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim();

const descriptionSchema = z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional()
    .nullable();

const codeSchema = z
    .string()
    .max(20, 'Code cannot exceed 20 characters')
    .trim()
    .toUpperCase()
    .optional()
    .nullable();

const curriculumSchema = z
    .string({ required_error: 'Curriculum is required' })
    .min(1, 'Curriculum is required')
    .max(100, 'Curriculum cannot exceed 100 characters')
    .trim();

const sectionSchema = z
    .string({ required_error: 'Section is required' })
    .min(1, 'Section is required')
    .max(50, 'Section cannot exceed 50 characters')
    .trim();

const gradeLevelSchema = z
    .string()
    .max(50, 'Grade level cannot exceed 50 characters')
    .trim()
    .optional()
    .nullable();

const academicYearSchema = z
    .string()
    .regex(/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY')
    .refine(
        (value) => {
            const [startYear, endYear] = value.split('-').map(Number);
            return endYear === startYear + 1;
        },
        'End year must be exactly one year after start year (e.g., 2025-2026)'
    )
    .optional()
    .nullable();

const dateStringSchema = z
    .string()
    .refine(
        (date) => !isNaN(new Date(date).getTime()),
        'Invalid date format'
    );
const scheduleSchema = z
    .object({
        days: z
            .array(
                z
                    .number()
                    .int('Day must be an integer')
                    .min(0, 'Day must be between 0-6')
                    .max(6, 'Day must be between 0-6')
            )
            .max(7, 'Cannot have more than 7 days')
            .optional()
            .default([]),
        startTime: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
            .optional()
            .nullable(),
        endTime: z
            .string()
            .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
            .optional()
            .nullable(),
        durationMinutes: z
            .number()
            .int('Duration must be an integer')
            .min(15, 'Duration must be at least 15 minutes')
            .max(480, 'Duration cannot exceed 8 hours')
            .optional()
            .nullable()
    })
    .refine(
        (data) => {
            // If both times provided, endTime should be after startTime
            if (data.startTime && data.endTime) {
                return data.endTime > data.startTime;
            }
            return true;
        },
        {
            message: 'End time must be after start time',
            path: ['endTime']
        }
    )
    .optional();
const tuitionFeeSchema = z.object({
    amount: z
        .number({ required_error: 'Tuition fee amount is required' })
        .min(0, 'Tuition fee cannot be negative'),
    currency: z
        .string()
        .length(3, 'Currency must be 3 characters')
        .toUpperCase()
        .default('BDT'),
    cycle: z
        .enum(['MONTHLY', 'QUARTERLY', 'SEMESTER', 'YEARLY', 'ONE_TIME'], {
            errorMap: () => ({ message: 'Invalid billing cycle' })
        })
        .default('MONTHLY')
});
const colorSchema = z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color')
    .default('#3B82F6');
const tagsSchema = z
    .array(
        z
            .string()
            .max(30, 'Tag cannot exceed 30 characters')
            .trim()
            .toLowerCase()
    )
    .max(10, 'Cannot have more than 10 tags')
    .optional()
    .default([]);
const statusSchema = z
    .enum(['ACTIVE', 'INACTIVE', 'ARCHIVED', 'COMPLETED'], {
        errorMap: () => ({ message: 'Status must be ACTIVE, INACTIVE, ARCHIVED, or COMPLETED' })
    });

// ==========================================
// CREATE Classroom Schema
// ==========================================

const createClassroomSchema = z
    .object({
        name: nameSchema,
        description: descriptionSchema,
        code: codeSchema,
        curriculum: curriculumSchema,
        section: sectionSchema,
        gradeLevel: gradeLevelSchema,
        academicYear: academicYearSchema,
        startDate: dateStringSchema,
        endDate: dateStringSchema.optional().nullable(),
        schedule: scheduleSchema,
        tuitionFee: tuitionFeeSchema,
        color: colorSchema,
        tags: tagsSchema,
    })
    .refine(
        (data) => {
            // Validate endDate is after startDate
            if (data.endDate && data.startDate) {
                return new Date(data.endDate) > new Date(data.startDate);
            }
            return true;
        },
        {
            message: 'End date must be after start date',
            path: ['endDate']
        }
    );

// ==========================================
// UPDATE Classroom Schema
// ==========================================

const updateClassroomSchema = z
    .object({
        name: nameSchema.optional(),
        description: descriptionSchema,
        code: codeSchema,
        curriculum: curriculumSchema.optional(),
        section: sectionSchema.optional(),
        gradeLevel: gradeLevelSchema,
        academicYear: academicYearSchema,
        startDate: dateStringSchema.optional(),
        endDate: dateStringSchema.optional().nullable(),
        schedule: scheduleSchema,
        tuitionFee: z
            .object({
                amount: z.number().min(0, 'Tuition fee cannot be negative').optional(),
                currency: z.string().length(3).toUpperCase().optional(),
                cycle: z.enum(['MONTHLY', 'QUARTERLY', 'SEMESTER', 'YEARLY', 'ONE_TIME']).optional()
            })
            .optional(),
        color: z
            .string()
            .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color')
            .optional(),
        status: statusSchema.optional(),
        tags: tagsSchema,
    })
    .refine(
        (data) => {
            if (data.endDate && data.startDate) {
                return new Date(data.endDate) > new Date(data.startDate);
            }
            return true;
        },
        {
            message: 'End date must be after start date',
            path: ['endDate']
        }
    );
// ==========================================
// Update Status Schema
// ==========================================

const updateClassroomStatusSchema = z.object({
    status: statusSchema
});

module.exports = {
    // Main CRUD
    createClassroomSchema,
    updateClassroomSchema,
    // Status
    updateClassroomStatusSchema,
    // Reusable (for other validators)
    scheduleSchema,
    tuitionFeeSchema,
    tagsSchema,
};