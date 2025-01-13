const multer = require("multer");
const path = require("path");
const fs = require('fs')
const { promisify } = require('util')

const deletefile = promisify(fs.unlink)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./uploads`);
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
    }
});

function fileFilter(req, file, cb) {
    const filetypes = /mp3|mpc|ogg|wav/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
}

const uploadImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1000000000 }
});

module.exports = { uploadImage, deletefile };