const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
const {genSalt, hash, compare} = bcrypt;
const {CustomError} = require('../helpers/customError');
const {sign} = require('jsonwebtoken');
const userSchema = new Schema({
    name: {type: String, required: true},

    email: {
        type: String,
        required: true,
        lowercase: true
    },

    password: {type: String, required: true, select: false},

    role: {
        type: String,
        enum: ["ADMIN", "TEACHER", "STAFF", "STUDENT"],
        required: true
    },

    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

    image: {
        url: String,
        public_id: String
    },

    phone: String,
    bio: String,
    dateOfBirth: Date,

    institute: {
        type: Schema.Types.ObjectId,
        ref: "Institute",
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    lastLoginAt: Date,
    invitedAt: Date,
    invitedBy: {type: Schema.Types.ObjectId, ref: "User"},

    resetPasswordTokenHash: String,
    resetPasswordExpires: Date

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
userSchema.methods.getAccessToken = function () {
    try {
        return sign({
                id: this._id,
                role: this.role,
                institute: this.institute
            }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN}
        )
    } catch (error) {
        console.log(error);
        throw new CustomError("Error getting access token", 500);
    }
}
module.exports = mongoose.models.User || mongoose.model('User', userSchema);