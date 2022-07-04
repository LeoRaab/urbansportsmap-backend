"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp = require("sharp");
const uuid = require("uuid");
const messages_1 = require("../constants/messages");
const http_error_1 = require("../models/http-error");
const resizeImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return next(new http_error_1.default(messages_1.default.CREATE_FAILED, 500));
    }
    const path = 'uploads/images/venues/' + req.params.venueId + '/';
    const images = req.files;
    for (const image of images) {
        const filename = uuid.v1() + '.jpeg';
        try {
            yield sharp(image.buffer)
                .resize(1024, 768, {
                kernel: sharp.kernel.nearest,
                fit: "cover"
            })
                .toFile(path + filename);
            image.filename = filename;
        }
        catch (e) {
            return next(new http_error_1.default(messages_1.default.CREATE_FAILED, 500));
        }
    }
    return next();
});
exports.default = resizeImages;
//# sourceMappingURL=resize-images.js.map