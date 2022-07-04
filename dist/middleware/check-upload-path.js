"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const messages_1 = require("../constants/messages");
const http_error_1 = require("../models/http-error");
const checkUploadPath = (req, res, next) => {
    const venueId = req.params.venueId;
    if (!venueId) {
        next(new http_error_1.default(messages_1.default.CREATE_FAILED, 404));
    }
    const uploadPath = 'uploads/images/venues/' + venueId;
    const isUploadPathExisting = fs.existsSync(uploadPath);
    if (!isUploadPathExisting) {
        try {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        catch (e) {
            console.error(e);
            next(new http_error_1.default(messages_1.default.CREATE_FAILED, 500));
        }
    }
    next();
};
exports.default = checkUploadPath;
//# sourceMappingURL=check-upload-path.js.map