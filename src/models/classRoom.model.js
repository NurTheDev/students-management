const mongoose = require("mongoose");
const { Schema } = mongoose;

const classroomSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Classroom name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters']
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
            default: null
        },
        code: {
            type: String,
            trim: true,
            uppercase: true,
            maxlength: [20, 'Code cannot exceed 20 characters'],
            default: null
        },
        curriculum: {
            type: String,
            required: [true, 'Curriculum is required'],
            trim: true,
            maxlength: [100, 'Curriculum cannot exceed 100 characters']
        },
        section: {
            type: String,
            required: [true, 'Section/Shift is required'],
            trim: true,
            maxlength: [50, 'Section cannot exceed 50 characters']
        },
        gradeLevel: {
            type: String,
            trim: true,
            maxlength: [50, 'Grade level cannot exceed 50 characters'],
            default: null
        },
        academicYear: {
            type: String,
            trim: true,
            match: [/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY'],
            default: null
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required']
        },
        endDate: {
            type: Date,
            default: null,
            validate: {
                validator: function(value) {
                    if (value && this.startDate) {
                        return value > this.startDate;
                    }
                    return true;
                },
                message: 'End date must be after start date'
            }
        },
        schedule: {
            days: [{
                type: Number,
                min: 0,
                max: 6
            }],
            startTime: {
                type: String,
                match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
                default: null
            },
            endTime: {
                type: String,
                match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
                default: null
            },
            durationMinutes: {
                type: Number,
                min: [15, 'Duration must be at least 15 minutes'],
                max: [480, 'Duration cannot exceed 8 hours'],
                default: null
            }
        },
        studentCount: {
            type: Number,
            default: 0,
            min: [0, 'Student count cannot be negative']
        },
        tuitionFee: {
            amount: {
                type: Number,
                required: [true, 'Tuition fee is required'],
                min: [0, 'Tuition fee cannot be negative']
            },
            currency: {
                type: String,
                default: 'BDT',
                uppercase: true,
                maxlength: 3
            },
            cycle: {
                type: String,
                enum: {
                    values: ['MONTHLY', 'QUARTERLY', 'SEMESTER', 'YEARLY', 'ONE_TIME'],
                    message: '{VALUE} is not a valid billing cycle'
                },
                default: 'MONTHLY'
            }
        },
        image: {
            url: {
                type: String,
                default: null
            },
            public_id: {
                type: String,
                default: null
            }
        },
        color: {
            type: String,
            match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'],
            default: '#3B82F6'
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, 'Creator is required'],
            index: true  // ◄── Added index for queries by creator
        },
        status: {
            type: String,
            enum: {
                values: ["ACTIVE", "INACTIVE", "ARCHIVED", "COMPLETED"],
                message: '{VALUE} is not a valid status'
            },
            default: "ACTIVE",
            index: true
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true
        },
        deletedAt: {
            type: Date,
            default: null
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        tags: [{
            type: String,
            trim: true,
            lowercase: true,
            maxlength: 30
        }]
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ==========================================
// Indexes
// ==========================================

// Unique code (globally unique for non-deleted classrooms)
classroomSchema.index(
    { code: 1 },
    {
        unique: true,
        partialFilterExpression: { isDeleted: false, code: { $ne: null } },
        sparse: true
    }
);

// Compound indexes for common queries
classroomSchema.index({ status: 1, isDeleted: 1 });
classroomSchema.index({ createdBy: 1, isDeleted: 1 });  // ◄── Added
classroomSchema.index({ academicYear: 1, isDeleted: 1 });

// Text index for search
classroomSchema.index(
    { name: 'text', description: 'text', code: 'text', curriculum: 'text' },
    { weights: { name: 10, code: 5, curriculum: 3, description: 1 } }
);

// ==========================================
// Virtuals
// ==========================================

classroomSchema.virtual('isInSession').get(function() {
    const now = new Date();
    const started = this.startDate <= now;
    const notEnded = !this.endDate || this.endDate >= now;
    return started && notEnded && this.status === 'ACTIVE';
});

classroomSchema.virtual('displayName').get(function() {
    if (this.code) {
        return `${this.code} - ${this.name}`;
    }
    return this.name;
});
classroomSchema.pre('save', async function(next) {
    if (this.isNew && !this.code) {
        const prefix = this.name
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 3)
            .toUpperCase();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');  // ◄── 4 digits for more uniqueness
        this.code = `${prefix}${random}`;
    }
    next();
});
classroomSchema.methods.softDelete = async function(deletedBy = null) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    this.status = 'ARCHIVED';
    return this.save({ validateBeforeSave: false });
};

classroomSchema.methods.restore = async function() {
    this.isDeleted = false;
    this.deletedAt = null;
    this.deletedBy = null;
    this.status = 'ACTIVE';
    return this.save({ validateBeforeSave: false });
};

classroomSchema.methods.updateStudentCount = async function(delta) {
    this.studentCount = Math.max(0, this.studentCount + delta);
    return this.save({ validateBeforeSave: false });
};
/**
 * Find active classroom by ID
 */
classroomSchema.statics.findByIdActive = function(id) {
    return this.findOne({
        _id: id,
        isDeleted: false
    }).populate('createdBy', 'name email');
};
/**
 * Check if code exists
 */
classroomSchema.statics.codeExists = async function(code, excludeId = null) {
    const query = {
        code: code.toUpperCase(),
        isDeleted: false
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    const exists = await this.findOne(query).lean();
    return !!exists;
};

module.exports = mongoose.model("Classroom", classroomSchema);