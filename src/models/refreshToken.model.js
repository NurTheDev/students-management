const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
const {genSalt, hash} = bcrypt;
const crypto = require('crypto');
const {CustomError} = require('../helpers/customError');

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
        required: true,
        index: true
    },
    isRevoked: {
        type: Boolean,
        default: false,
        index: true
    },
    createdByIp: {
        type: String,
        default: null,
    },
    userAgent: {
        type: String,
        default: null,
    },
    revokedAt: {
        type: Date,
        default: null,
    },
    revokedReason: {
        type: String,
        default: null
    },
    revokedByIp: {
        type: String,
        default: null
    },
    replacedByToken : {
        type: String,
        default: null
    }
}, {timestamps: true});
// TTL index to automatically delete expired tokens
refreshTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});
// Compound index to quickly find active tokens for a user
refreshTokenSchema.index({user: 1, isRevoked: 1});
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
//Compare token (fixed - added await)
refreshTokenSchema.methods.compareToken = function (token) {
    try {
        return bcrypt.compare(token, this.tokenHash);
    } catch (error) {
        console.error(error);
        throw new CustomError("Error comparing token", 500);
    }
}
// Check if token is Valid (not revoked and not expired)
refreshTokenSchema.methods.isValid = function () {
    return !this.isRevoked && new Date() < this.expiresAt;
}
// Check if token is Revoked
refreshTokenSchema.methods.revoke = async function (ip = null, reason = null) {
    this.isRevoked = true;
    this.revokedAt = new Date();
    this.revokedByIp = ip;
    this.revokedReason = reason;
    return this.save()
}
// create new refresh token
refreshTokenSchema.statics.createToken = async function (userId, ip = null, userAgent = null) {
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRY));
    const refreshToken = await this.create({
        user: userId,
        tokenHash: token,
        expiresAt,
        createdByIp: ip,
        userAgent
    });
    return {refreshToken, token};
}
// find valid token by user
refreshTokenSchema.statics.findValidTokenByUser = async function (userId) {
    return await this.findOne({
        user: userId,
        isRevoked: false,
        expiresAt: {$gt: new Date()}
    })
}
// revoke all tokens for a user
refreshTokenSchema.statics.revokeAllTokensForUser = async function (userId, ip = null, reason = null) {
    return await this.updateMany({
        user: userId,
        isRevoked: false
    }, {
        isRevoked: true,
        revokedAt: new Date(),
        revokedReason: reason,
    })
}
// remove expired tokens
refreshTokenSchema.statics.removeExpiredTokens = async function (){
    return await this.deleteMany({
        $or:[
            {expiresAt: {$lt: new Date()}},
            {isRevoked: true, revokedAt: {$lt: new Date(Date.now() - 7*24*60*60*1000)}}
        ]

    })
}
module.exports = mongoose.models.RefreshToken || mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
