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
const messages_1 = require("../constants/messages");
const http_error_1 = require("../models/http-error");
const user_1 = require("../models/user");
const base_repository_1 = require("./base-repository");
const venues_repository_1 = require("./venues-repository");
class FavoritesRepository extends base_repository_1.default {
    constructor() {
        super(user_1.default);
    }
    createFavorite(userId, venueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, venue, error } = yield this.prepareFavorites(userId, venueId);
            if (error) {
                return { error };
            }
            if (!user) {
                return { error: new http_error_1.default(messages_1.default.CREATE_FAILED, 404) };
            }
            if (!venue) {
                return { error: new http_error_1.default(messages_1.default.CREATE_FAILED, 404) };
            }
            try {
                user.favorites.push(venue);
                yield user.save();
                return { favorites: user.favorites };
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.CREATE_FAILED, 500) };
            }
        });
    }
    deleteFavorite(userId, venueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, venue, error } = yield this.prepareFavorites(userId, venueId);
            if (error) {
                return { error };
            }
            if (!user) {
                return { error: new http_error_1.default(messages_1.default.DELETE_FAILED, 404) };
            }
            if (!venue) {
                return { error: new http_error_1.default(messages_1.default.DELETE_FAILED, 404) };
            }
            try {
                user.favorites.pull(venue);
                yield user.save();
                return { favorites: user.favorites };
            }
            catch (e) {
                return { error: new http_error_1.default(messages_1.default.DELETE_FAILED, 500) };
            }
        });
    }
    prepareFavorites(userId, venueId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { result: user, error: userError } = yield this.readById(userId);
            const venuesRepository = new venues_repository_1.default();
            const { result: venue, error: venueError } = yield venuesRepository.readById(venueId);
            if (userError || venueError) {
                return { error: userError || venueError };
            }
            if (!user) {
                return { error: new http_error_1.default(messages_1.default.NO_DATA_FOUND, 404) };
            }
            if (!venue) {
                return { error: new http_error_1.default(messages_1.default.NO_DATA_FOUND, 404) };
            }
            return {
                user: user,
                venue: venue
            };
        });
    }
}
exports.default = FavoritesRepository;
//# sourceMappingURL=favorites-repository.js.map