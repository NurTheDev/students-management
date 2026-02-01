const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
const {genSalt, hash} = bcrypt;
const userSchema = require('./user.model');
const {CustomError} = require('../helpers/customError');
const {sign} = require("jsonwebtoken");
const refreshTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    tokenHash: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

    isRevoked: {
        type: Boolean,
        default: false
    },

    createdByIp: String,
    userAgent: String,

}, {timestamps: true});

// Hash token before saving
refreshTokenSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('tokenHash')) {
            return next();
        }
        const salt = await genSalt(10);
        this.tokenHash = await hash(this.tokenHash, salt);
        next();
    } catch (error) {
        console.error(error);
    }
})
refreshTokenSchema.methods.comparePassword = function (token) {
    try {
        return bcrypt.compare(token, this.tokenHash);
    } catch (error) {
        console.error(error);
        throw new CustomError("Error comparing token", 500);
    }
}
refreshTokenSchema.getRevoked = function () {
    return this.isRevoked === true;
}
refreshTokenSchema.methods.getRefreshToken = function () {
    try {
        return sign({
            userId: this.user,
        }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
    } catch (error) {
        console.error(error);
        throw new CustomError("Error getting refresh token", 500);
    }
}


module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
