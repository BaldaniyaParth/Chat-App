const multer = require("multer");

exports.uploader = multer({
    storage : multer.diskStorage({}),
    limits : {fileSize : 5000000} 
})

