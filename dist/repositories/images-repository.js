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
const mongoose = require("mongoose");
const promises_1 = require("node:fs/promises");
const messages_1 = require("../constants/messages");
const http_error_1 = require("../models/http-error");
const venue_image_1 = require("../models/venue-image");
const base_repository_1 = require("./base-repository");
const users_repository_1 = require("./users-repository");
const venues_repository_1 = require("./venues-repository");
class ImagesRepository extends base_repository_1.default {
    constructor() {
        super(venue_image_1.default);
    }
    createImages(imageFilenames, venueId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const venuesRepository = new venues_repository_1.default();
            const usersRepository = new users_repository_1.default();
            const { result: venue, error: venueError } = yield venuesRepository.readById(venueId);
            const { result: user, error: userError } = yield usersRepository.readById(userId);
            if (venueError || userError) {
                return { error: venueError || userError };
            }
            if (!venue || !user) {
                return { error: new http_error_1.default(messages_1.default.CREATE_FAILED, 404) };
            }
            const createdImages = [];
            for (const filename of imageFilenames) {
                const altText = venue.name + ' | ' + new Date().toLocaleDateString('de-DE');
                const createdImage = new venue_image_1.default({
                    filename,
                    altText,
                    user,
                    venue
                });
                try {
                    const session = yield mongoose.startSession();
                    session.startTransaction();
                    yield createdImage.save({ session });
                    venue.images.push(createdImage);
                    yield venue.save({ session });
                    user.images.push(createdImage);
                    yield user.save({ session });
                    yield session.commitTransaction();
                }
                catch (e) {
                    return { error: new http_error_1.default(messages_1.default.CREATE_FAILED, 500) };
                }
            }
            return { createdImages };
        });
    }
    deleteImage(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { result: image, error } = yield this.readByIdAndPopulate(imageId, ['user', 'venue']);
            if (error) {
                return { error };
            }
            if (!image) {
                return { error: new http_error_1.default(messages_1.default.DELETE_FAILED, 404) };
            }
            try {
                const path = 'uploads/images/venues/' + image.venue.id + '/';
                yield (0, promises_1.rm)(path + image.filename);
            }
            catch (e) {
                console.log(e);
                return { error: new http_error_1.default(messages_1.default.DELETE_FAILED, 404) };
            }
            try {
                const session = yield mongoose.startSession();
                session.startTransaction();
                yield image.remove({ session });
                image.user.images.pull(image);
                image.venue.images.pull(image);
                yield image.user.save({ session });
                yield image.venue.save({ session });
                yield session.commitTransaction();
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.DELETE_FAILED, 500) };
            }
            return {
                isDeleted: true
            };
        });
    }
}
exports.default = ImagesRepository;
//# sourceMappingURL=images-repository.js.map