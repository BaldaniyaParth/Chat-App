const multer = require("multer");

// Multer middleware for file uploading
exports.uploader = multer({
    
    storage: multer.diskStorage({}),
    
    limits: { fileSize: 5000000 } // Set file size limit to 5MB
});


