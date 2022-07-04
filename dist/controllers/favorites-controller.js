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
exports.deleteFavorite = exports.createFavorite = exports.getFavorites = void 0;
const http_error_1 = require("../models/http-error");
const favorites_repository_1 = require("../repositories/favorites-repository");
const messages_1 = require("../constants/messages");
const favoritesRepository = new favorites_repository_1.default();
const getFavorites = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { result: user, error } = yield favoritesRepository.readByIdAndPopulate(userId, 'favorites');
    if (error) {
        return next(error);
    }
    if (!user) {
        return next(new http_error_1.default(messages_1.default.NO_DATA_FOUND, 404));
    }
    res.json({
        favorites: user.toObject({ getters: true }).favorites
    });
});
exports.getFavorites = getFavorites;
const createFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const venueId = req.params.venueId;
    const userId = req.userId;
    const { favorites, error } = yield favoritesRepository.createFavorite(userId, venueId);
    if (error) {
        return next(error);
    }
    if (!favorites) {
        return next(new http_error_1.default(messages_1.default.CREATE_FAILED, 500));
    }
    res.status(201).json({
        message: messages_1.default.CREATE_SUCCESSFUL,
        favorites
    });
});
exports.createFavorite = createFavorite;
const deleteFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const venueId = req.params.venueId;
    const userId = req.userId;
    const { favorites, error } = yield favoritesRepository.deleteFavorite(userId, venueId);
    if (error) {
        return next(error);
    }
    if (!favorites) {
        return next(new http_error_1.default(messages_1.default.DELETE_FAILED, 500));
    }
    res.json({
        message: messages_1.default.DELETE_SUCCESFUL,
        favorites
    });
});
exports.deleteFavorite = deleteFavorite;
//# sourceMappingURL=favorites-controller.js.map