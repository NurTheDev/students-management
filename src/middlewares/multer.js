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
    // destination:
})
