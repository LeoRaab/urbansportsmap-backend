"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};
const fileUpload = multer({
    limits: {
        fileSize: 2097152
    },
    storage: multer.memoryStorage(),
    fileFilter: (request, file, callback) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        const error = isValid ? null : new Error();
        callback(null, isValid);
    }
});
exports.default = fileUpload;
//# sourceMappingURL=file-upload.js.map