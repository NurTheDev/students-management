const cloudinary = require('cloudinary').v2;
const {CustomError} = require("../helpers/customError");
require('dotenv').config();
const fs = require('fs');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadImage = async (file) => {
    try {
        if(!file) throw new CustomError("File is required", 400);
        const result = await cloudinary.uploader.upload(file, {
            resource_type: "image",
            quality: "auto"
        })
        if (result) {
            fs.unlinkSync(file)
            return result
        }
    } catch (error) {
        if (fs.existsSync(file) && file) {
            fs.unlinkSync(file)
        }
        throw new CustomError(error.message, 400)
    }
}
exports.deleteImage = async (public_id) => {
    try {
        return await cloudinary.uploader.destroy(public_id)
    } catch (error) {
        console.error(error);
        throw new CustomError(error.message, 400)
    }
}