const fs = require('fs');
const multer = require('multer');
const path = require('path');
const uploadPath = path.join(global.appRoot, 'public', 'temp');

// Ensure upload directory exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

//storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
})
const fileFilter = (req, file, cb) => {
    const validMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ]
    if (!validMimeTypes.includes(file.mimetype)) {
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false)
    }
    cb(null, true)
}

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 15 }, fileFilter }) // 15MB
module.exports = upload
