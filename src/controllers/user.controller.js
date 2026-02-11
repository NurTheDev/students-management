const {asyncHandler} = require("../helpers/asyncHandler");
const {success} = require("../helpers/apiResponse");
const userSchema = require("../models/user.model");
const {CustomError} = require("../helpers/customError");
const {uploadImage, deleteImage} = require("../helpers/cloudinary");
exports.getProfile = asyncHandler(async (req, res, next) => {
    try {
        const user = await userSchema.findById(req.user.id).select("-password -__v");
        if (!user) {
            return next(new CustomError("User not found", 404));
        }
        success(res, "User profile fetched successfully", user);
    } catch (error) {
        next(error);
    }
});
// Update user profile
exports.updateProfile = asyncHandler(async (req, res, next) => {
    try {
        const {email, phone, name, bio, dateOfBirth} = req.body;
        const user = await userSchema.findById(req.user.id);
        if (!user) {
            return next(new CustomError("User not found", 404));
        }
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if(req.files?.image?.[0]){
            const imageFile = req.files.image[0]
            // delete old image from cloudinary
            if(user.image?.public_id){
                await deleteImage(user.image.public_id)
            }
            // upload new image to cloudinary
            const result = await uploadImage(imageFile.path)
            user.image = {
                url: result.secure_url,
                public_id: result.public_id
            }
        }
        await user.save();
        success(res, {
            id: user._id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            bio: user.bio,
            dateOfBirth: user.dateOfBirth,
            image: user.image
        }, "User profile updated successfully", 200);
    } catch (error) {
        next(error);
    }
});

// Soft delete user profile
exports.deleteProfile = asyncHandler(async (req, res, next) => {
    try {
        const user = await userSchema.findById(req.user.id);
        if (!user) {
            return next(new CustomError("User not found", 404));
        }
        await user.softDelete();
        success(res, "User profile deleted successfully", null, 200);
    } catch (error) {
        next(error);
    }
});
// Get user profile by ID (Admin only)
exports.getUserById = asyncHandler(async (req, res, next) => {
    try {
        const user = await userSchema.findById(req.params.id).select("-password -__v");
        if (!user) {
            return next(new CustomError("User not found", 404));
        }
        success(res, "User profile fetched successfully", user);
    } catch (error) {
        next(error);
    }
});

// Get all users (Admin only)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    try {
        const users = await userSchema.find({isDeleted: false}).select("-password -__v");
        success(res, "Users fetched successfully", users);
    } catch (error) {
        next(error);
    }
});

// restore soft deleted user (Admin only)
exports.restoreUser = asyncHandler(async (req, res, next) => {
    try {
        const user = await userSchema.findById(req.params.id);
        if (!user) {
            return next(new CustomError("User not found", 404));
        }
        if (!user.isDeleted) {
            return next(new CustomError("User is not deleted", 400));
        }
        await user.restore(user.email.replace(/^deleted_\d+_/, ''));
        success(res, "User restored successfully", null, 200);
    } catch (error) {
        next(error);
    }
});

//get all deleted users (Admin only)
exports.getDeletedUser = asyncHandler(async (req, res, next) => {
    try {
        const users = await userSchema.find({isDeleted: true}).select("-password -__v");
        success(res, "Deleted users fetched successfully", users);
    } catch (error) {
        next(error);
    }
});

// get user by status (Admin only)
exports.getUserByStatus = asyncHandler(async (req, res, next) => {
    try {
        const {status} = req.query;
        if (!status || !["ACTIVE", "INACTIVE"].includes(status)) {
            return next(new CustomError("Invalid status. Allowed values are ACTIVE or INACTIVE", 400));
        }
        const users = await userSchema.find({status: status, isDeleted: false}).select("-password -__v");
        success(res, `Users with status ${status} fetched successfully`, users);
    } catch (error) {
        next(error);
    }
});
//create user (Admin only)
exports.createUser = asyncHandler(async (req, res, next) => {
    try {
        const {email, phone, name, password, role} = req.body;
        if (!email || !password || !name) {
            return next(new CustomError("Email, name and password are required", 400));
        }
        const existingUser = await userSchema.findOne({email: email});
        if (existingUser) {
            return next(new CustomError("Email already in use", 400));
        }
        const newUser = new userSchema({
            email,
            phone,
            name,
            password,
            role: role || "USER"
        });
        await newUser.save();
        success(res, {
            id: newUser._id,
            email: newUser.email,
            phone: newUser.phone,
            name: newUser.name,
            role: newUser.role
        }, "User created successfully", 201);
    } catch (error) {
        next(error);
    }
});