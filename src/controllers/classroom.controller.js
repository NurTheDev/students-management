const {asyncHandler} = require("../helpers/asyncHandler");
const {success} = require("../helpers/apiResponse");
const classroomSchema = require("../models/classRoom.model");
const {CustomError} = require("../helpers/customError");
const {uploadImage} = require("../helpers/cloudinary");
exports.createClassroom = asyncHandler(async (req, res) => {
    try {
        const data = req.body;
        const {code} = data
        if(code){
            const codeExists = await classroomSchema.codeExists(code)
            if(codeExists){
                throw new CustomError("Code already exists", 400)
            }
        }
        if(req.files && req.files.image){
            const imageFile = req.files.image[0]
            const result = await uploadImage(imageFile.path)
            data.image = {
                url: result.secure_url,
                public_id: result.public_id
            }
        }
        data.createdBy = req.user.id
        data.startDate = new Date(data.startDate)
        data.endDate = data.endDate ? new Date(data.endDate) : null
        const classroom = await classroomSchema.create(data)
        success(res, classroom, "Classroom created successfully", 201);
    } catch (error) {
        console.error(error);
        throw new CustomError(error.message, 400)
    }
});

//get classroom by id
exports.getClassroomById = asyncHandler(async (req, res, next) => {
    try {
        const {id} = req.params
        const classroom = await classroomSchema.findById(id).populate("createdBy", "name email")
        if (!classroom) {
            return next(new CustomError("Classroom not found", 404));
        }
        success(res, classroom, "Classroom fetched successfully", 200);
    } catch (error) {
        next(error);
    }
});

//get all classrooms
exports.getAllClassrooms = asyncHandler(async (req, res, next) => {
    console.log("fetching classrooms")
    try {
        const classrooms = await classroomSchema.find({isDeleted: false}).populate("createdBy", "name email")
        success(res, classrooms, "Classrooms fetched successfully", 200);
    } catch (error) {
        next(error);
    }
});

// update classroom
exports.updateClassroom = asyncHandler(async (req, res, next) => {
    try {
        const {id} = req.params
        const data = req.body
        const classroom = await classroomSchema.findById(id)
        if (!classroom) {
            return next(new CustomError("Classroom not found", 404));
        }
        if (classroom.createdBy.toString() !== req.user.id && req.user.role !== "ADMIN") {
            return next(new CustomError("Unauthorized", 401));
        }
        if(req.files && req.files.image){
            const imageFile = req.files.image[0]
            const result = await uploadImage(imageFile.path)
            data.image = {
                url: result.secure_url,
                public_id: result.public_id
            }
        }
        const updatedClassroom = await classroomSchema.findByIdAndUpdate(id, data, {new: true})
        success(res, updatedClassroom, "Classroom updated successfully", 200);
    } catch (error) {
        next(error);
    }
});
//delete classroom
exports.deleteClassroom = asyncHandler(async (req, res, next) => {
    try {
        const {id} = req.params
        const classroom = await classroomSchema.findById(id)
        if (!classroom) {
            return next(new CustomError("Classroom not found", 404));
        }
        if (classroom.createdBy.toString() !== req.user.id && req.user.role !== "ADMIN") {
            return next(new CustomError("Unauthorized", 401));
        }
        await classroom.softDelete()
        success(res, null, "Classroom deleted successfully", 200);
    } catch (error) {
        next(error);
    }
});
//get deleted classrooms
exports.getDeletedClassrooms = asyncHandler(async (req, res, next) => {
    try {
        const classrooms = await classroomSchema.find({isDeleted: true}).populate("createdBy", "name email")
        success(res, classrooms, "Deleted classrooms fetched successfully", 200);
    } catch (error) {
        next(error);
    }
});
//restore classroom
exports.restoreClassroom = asyncHandler(async (req, res, next) => {
    try {
        const {id} = req.params
        const classroom = await classroomSchema.findById(id)
        if (!classroom) {
            return next(new CustomError("Classroom not found", 404));
        }
        if (classroom.createdBy.toString() !== req.user.id && req.user.role !== "ADMIN") {
            return next(new CustomError("Unauthorized", 401));
        }
        await classroom.restore()
        success(res, null, "Classroom restored successfully", 200);
    } catch (error) {
        next(error);
    }
});