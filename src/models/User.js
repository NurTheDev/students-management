const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
const {genSalt, hash, compare} = bcrypt;
const {CustomError} = require('../helpers/customError');
const {sign} = require('jsonwebtoken');
const userSchema = new Schema({
        username: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        email: {type: String, unique: true},
        emailVerified: {type: Boolean, default: false},
        password: {type: String, required: true},
        phone: {type: String},
        phoneVerified: {type: Boolean, default: false},
        bio: {type: String},
        dateOfBirth: {type: Date},
        institute: {type: String},
        address: {
            type: String, default: "N/A"
        }, city: {
            type: String, trim: true, default: "N/A"
        }, state: {
            type: String, default: "N/A", trim: true
        }, country: {
            type: String, default: "Bangladesh"
        }, zipCode: {
            type: String, trim: true
        },
        image: {
            url: String,
            public_id: String
        },
        role: {type: String},
        isActive: {type: Boolean, default: true},
        emailVerificationToken: {type: String},
        emailVerificationTokenExpiry: {type: Date},
        resetPasswordToken: {type: String},
        resetPasswordExpires: {type: Date},
        phoneVerificationToken: {type: String},
        phoneVerificationTokenExpiry: {type: Date},
        refreshToken: {type: String},
        refreshExpires: {type: Date},
        twoFactorToken: {type: String},
        twoFactorExpires: {type: Date},
        twoFactorEnabled: {type: Boolean, default: false},
    }, {
        timestamps: true,
        versionKey: false
    }
);
// Hash password before saving
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            const salt = await genSalt(10);
            this.password = await hash(this.password, salt);
        }
        next()
    } catch (error) {
        console.log(error);
        next(error);
    }
})
// Compare password method
userSchema.methods.comparePassword = async function (password) {
    try {
        return await compare(password, this.password);
    } catch (error) {
        console.error(error);
        throw new CustomError("Error comparing passwords", 500);
    }
}
//check at-least email or phone any one is provided
userSchema.pre("save", function (next) {
    if (!this.email && !this.phone) {
        return next(new CustomError("Either email or phone number must be provided", 400));
    }
    next();
})

// generate access token with the help of jwt
userSchema.methods.getAccessToken = function () {
    try {
        return sign({
                id: this._id,
                username: this.username,
                email: this.email,
                role: this.role,
                phone: this.phone
            }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN}
        )
    } catch (error) {
        console.log(error);
        throw new CustomError("Error getting access token", 500);
    }
}
// generate refresh token
userSchema.methods.getRefreshToken = function () {
    try {
        return sign({
                id: this._id,
            }, process.env.REFRESH_TOKEN_EXPIRY, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
        )
    } catch (error) {
        console.error(error);
        throw new CustomError("Error getting refresh token", 500);
    }
}
module.exports = mongoose.models.User || mongoose.model('User', userSchema);