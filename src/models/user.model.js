const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
const {genSalt, hash, compare} = bcrypt;
const {CustomError} = require('../helpers/customError');
const {sign} = require('jsonwebtoken');
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Never return password by default
    },
    role: {
        type: String,
        enum: {
            values: ["ADMIN", "TEACHER", "STAFF", "STUDENT"],
            message: '{VALUE} is not a valid role'
        },
        required: [true, 'Role is required']
    },

    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "INACTIVE"],
            message: '{VALUE} is not a valid status'
        },
        default: "ACTIVE"
    },

    isDeleted: {
        type: Boolean,
        default: false,
        index: true
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

    phone: {
        type: String,
        trim: true,
        default: null
    },

    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        trim: true,
        default: null
    },

    dateOfBirth: {
        type: Date,
        default: null
    },

    institute: {
        type: Schema.Types.ObjectId,
        ref: "Institute"
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    lastLoginAt: Date,
    invitedAt: Date,
    invitedBy: {type: Schema.Types.ObjectId, ref: "User"},
    resetPasswordTokenHash: String,
    resetPasswordExpires: Date,

}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.resetPasswordToken;
            delete ret.resetPasswordExpires;
            return ret;
        }
    }
});

userSchema.index(
    { email: 1, isDeleted: 1 },
    { unique: true }
);



// Hash password before saving
userSchema.pre("save", async function (next) {
    try {
        if(!this.isModified('password')) {
            return next();
        }
        const salt = await genSalt(12);
        this.password = await hash(this.password, salt);
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
})
/**
 * Clear reset token after password change
 */
userSchema.pre('save', function(next) {
    if (this.isModified('password') && !this.isNew) {
        this.resetPasswordToken = null;
        this.resetPasswordExpires = null;
    }
    next();
});
// Compare password method
userSchema.methods.comparePassword = async function (userPassword) {
    try {
        const password = await this.constructor.findById(this._id).select('password');
        return compare(userPassword, password.password);
    } catch (error) {
        console.error(error);
        throw new CustomError("Error comparing passwords", 500);
    }
}

// generate access token with the help of jwt
userSchema.methods.getAccessToken = function() {
    const payload = {
        id: this._id,
        role: this.role,
        email: this.email,
        phone: this.phone
    }
    return sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}
/**
 * Soft delete user
 */
userSchema.methods.softDelete = async function() {
    this.isDeleted = true;
    this.status = 'INACTIVE';
    this.email = `deleted_${Date.now()}_${this.email}`; // Free up email for reuse
    return this.save({ validateBeforeSave: false });
};
/**
 * Restore soft deleted user
 * @param {String} originalEmail - Original email to restore
 */
userSchema.methods.restore = async function(originalEmail) {
    this.isDeleted = false;
    this.status = 'ACTIVE';
    if (originalEmail) {
        this.email = originalEmail;
    }
    return this.save({validateBeforeSave: false});
}

module.exports = mongoose.models.User || mongoose.model('User', userSchema);