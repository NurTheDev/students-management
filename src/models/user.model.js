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

    password: {type: String, required: true},

    role: {
        type: String,
        enum: ["ADMIN", "TEACHER", "STAFF"],
        required: true
    },

    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
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

    invitedAt: Date,
    invitedBy: {type: Schema.Types.ObjectId, ref: "User"},

    resetPasswordTokenHash: String,
    resetPasswordExpires: Date

}, {timestamps: true, versionKey: false});

userSchema.index({email: 1}, {unique: true});


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

// generate access token with the help of jwt
userSchema.methods.getAccessToken = function () {
    try {
        return sign({
                id: this._id,
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
module.exports = mongoose.models.User || mongoose.model('User', userSchema);