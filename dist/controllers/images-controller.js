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
exports.deleteImage = exports.uploadImage = exports.getImagesByVenueAndUser = exports.getImagesByUser = exports.getImagesByVenue = void 0;
const messages_1 = require("../constants/messages");
const http_error_1 = require("../models/http-error");
const images_repository_1 = require("../repositories/images-repository");
const imagesRepository = new images_repository_1.default();
const getImagesByVenue = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const venueId = req.params.venueId;
    const { result: images, error } = yield imagesRepository.readAll({ condition: { venue: venueId } });
    if (error) {
        return next(error);
    }
    if (!images) {
        return next(new http_error_1.default(messages_1.default.NO_DATA_FOUND, 404));
    }
    res.json({
        images: images.map((image) => image.toObject({ getters: true }))
    });
});
exports.getImagesByVenue = getImagesByVenue;
const getImagesByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { result: images, error } = yield imagesRepository.readAll({ condition: { user: userId } });
    if (error) {
        return next(error);
    }
    if (!images) {
        return next(new http_error_1.default(messages_1.default.NO_DATA_FOUND, 404));
    }
    res.json({
        images: images.map((image) => image.toObject({ getters: true }))
    });
});
exports.getImagesByUser = getImagesByUser;
const getImagesByVenueAndUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const venueId = req.params.venueId;
    const userId = req.userId;
    const { result: images, error } = yield imagesRepository.readAll({ condition: { venue: venueId, user: userId } });
    if (error) {
        return next(error);
    }
    if (!images) {
        return next(new http_error_1.default(messages_1.default.NO_DATA_FOUND, 404));
    }
    res.json({
        images: images.map((image) => image.toObject({ getters: true }))
    });
});
exports.getImagesByVenueAndUser = getImagesByVenueAndUser;
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const venueId = req.params.venueId;
    const userId = req.userId;
    if (!req.files) {
        return next(new http_error_1.default(messages_1.default.CREATE_FAILED, 500));
    }
    if (!venueId || !userId) {
        return next(new http_error_1.default(messages_1.default.MISSING_PARAMETERS, 500));
    }
    const images = req.files;
    const imageFilenames = images.map(image => image.filename);
    const { createdImages, error } = yield imagesRepository.createImages(imageFilenames, venueId, userId);
    if (error) {
        return next(error);
    }
    if (!createdImages) {
        return next(new http_error_1.default(messages_1.default.CREATE_FAILED, 500));
    }
    res.status(201).json({
        message: messages_1.default.CREATE_SUCCESSFUL
    });
});
exports.uploadImage = uploadImage;
const deleteImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const imageId = req.params.imageId;
    const userId = req.userId;
    if (!imageId || !userId) {
        return next(new http_error_1.default(messages_1.default.DELETE_FAILED, 500));
    }
    const { isDeleted, error } = yield imagesRepository.deleteImage(imageId);
    if (error) {
        return next(error);
    }
    if (!isDeleted) {
        return next(new http_error_1.default(messages_1.default.DELETE_FAILED, 500));
    }
    res.json({
        message: messages_1.default.DELETE_SUCCESFUL
    });
});
exports.deleteImage = deleteImage;
//# sourceMappingURL=images-controller.js.map