const mongoose = require('mongoose');
const {Schema} = mongoose;
const {CustomError} = require('../helpers/customError');

const inviteSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    role: {
        type: String,
        enum: {
            values: ["ADMIN", "TEACHER", "STAFF", "STUDENT"],
            message: '{VALUE} is not a valid role'
        },
        required: [true, 'Role is required'],
        default: "STUDENT"
    },
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "ACCEPTED", "EXPIRED", "REVOKED"],
            message: '{VALUE} is not a valid status'
        },
        default: "PENDING",
        index: true
    },
    acceptedAt: {
        type: Date,
        default: null
    },
    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Inviter is required']
    },
    acceptedByUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    message: {
        type: String,
        maxlength: [500, 'Message cannot exceed 500 characters'],
        trim: true,
        default: null
    },
})
inviteSchema.index({email: 1, status: 1});
inviteSchema.index({token: 1, status: 1});
inviteSchema.index({expiresAt: 1}, {expireAfterSeconds: 0}, );
inviteSchema.index({status: 1});

//expriess check
inviteSchema.virtual('isExpired').get(function () {
    return this.expiresAt <= new Date();
})
inviteSchema.virtual('isAccepted').get(function () {
    return this.status === 'ACCEPTED';
});
// mark invite as accepted
inviteSchema.statics.markAsAccepted = async function (token, userId) {
    const invite = await this.findOne({token, status: "PENDING", expiresAt: {$gt: new Date()}});
    if (!invite) {
        throw new CustomError('Invalid or expired invite token', 400);
    }
    invite.status = "ACCEPTED";
    invite.acceptedAt = new Date();
    invite.acceptedByUser = userId;
    await invite.save();
    return invite;
};

const Invite = mongoose.models.inviteSchema || mongoose.model('Invite', inviteSchema);
module.exports = Invite;