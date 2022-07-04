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
exports.createVenues = exports.getVenueById = exports.getVenues = void 0;
const fetch_venues_1 = require("../util/fetch-venues");
const venue_1 = require("../models/venue");
const http_error_1 = require("../models/http-error");
const venues_repository_1 = require("../repositories/venues-repository");
const messages_1 = require("../constants/messages");
const venuesRepository = new venues_repository_1.default();
const getVenues = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { result: venues, error } = yield venuesRepository.readAll();
    if (error) {
        return next(error);
    }
    if (!venues) {
        return next(new http_error_1.default(messages_1.default.NO_DATA_FOUND, 404));
    }
    res.json({
        venues: venues.map((venue) => venue.toObject({ getters: true }))
    });
});
exports.getVenues = getVenues;
const getVenueById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const venueId = req.params.venueId;
    const { result: venue, error } = yield venuesRepository.readById(venueId);
    if (error) {
        return next(error);
    }
    if (!venue) {
        return next(new http_error_1.default(messages_1.default.NO_DATA_FOUND, 500));
    }
    res.json({
        venue: venue.toObject({ getters: true })
    });
});
exports.getVenueById = getVenueById;
const createVenues = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sportFacilities = yield (0, fetch_venues_1.fetchSportFacilities)();
    const playgrounds = yield (0, fetch_venues_1.fetchPlaygrounds)();
    const fetchedVenues = [...sportFacilities, ...playgrounds];
    yield venue_1.default.insertMany(fetchedVenues);
    res.status(201).json({
        message: fetchedVenues.length + ' of Venues have been created.',
        createdVenues: fetchedVenues
    });
});
exports.createVenues = createVenues;
//# sourceMappingURL=venues-controller.js.map