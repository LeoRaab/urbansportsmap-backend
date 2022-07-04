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
exports.fetchPlaygrounds = exports.fetchSportFacilities = void 0;
const axios_1 = require("axios");
const http_error_1 = require("../models/http-error");
const sport_type_1 = require("../models/sport-type");
const fetchSportFacilities = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get('https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPORTSTAETTENOGD&srsName=EPSG:4326&outputFormat=json');
    const data = response.data;
    if (!data) {
        throw new http_error_1.default('Could not fetch Sport Facilities of Vienna', 404);
    }
    return data.features
        .filter(sportFacility => findSportTypes(sportFacility.properties.SPORTSTAETTEN_ART).length > 0)
        .map(sportFacility => {
        const { properties, geometry } = sportFacility;
        const lat = geometry.coordinates[1];
        const lng = geometry.coordinates[0];
        return {
            name: clearSportFacilityName(properties.ADRESSE),
            location: {
                lat,
                lng
            },
            sportTypes: findSportTypes(properties.SPORTSTAETTEN_ART)
        };
    });
});
exports.fetchSportFacilities = fetchSportFacilities;
const fetchPlaygrounds = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get('https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPIELPLATZPUNKTOGD&srsName=EPSG:4326&outputFormat=json');
    const data = response.data;
    if (!data) {
        throw new http_error_1.default('Could not fetch Playgrounds of Vienna', 404);
    }
    return data.features
        .filter(sportFacility => findSportTypes(sportFacility.properties.SPIELPLATZ_DETAIL).length > 0)
        .map(sportFacility => {
        const { properties, geometry } = sportFacility;
        const lat = geometry.coordinates[1];
        const lng = geometry.coordinates[0];
        return {
            name: properties.ANL_NAME,
            location: {
                lat,
                lng
            },
            sportTypes: findSportTypes(properties.SPIELPLATZ_DETAIL)
        };
    });
});
exports.fetchPlaygrounds = fetchPlaygrounds;
const clearSportFacilityName = (sportFacilityText) => {
    const splitText = sportFacilityText.split(',');
    let clearedName;
    if (splitText.length > 2) {
        clearedName = splitText[2];
    }
    else {
        clearedName = splitText[1];
    }
    const foundNumber = clearedName.search(/[0-9]/);
    if (foundNumber > -1) {
        clearedName = clearedName.substring(0, foundNumber);
    }
    return clearedName.trim();
};
const findSportTypes = (sportTypesText) => {
    const foundSportTypes = [];
    for (const sportType of sport_type_1.ALLOWED_SPORT_TYPES) {
        if (sportTypesText.toLowerCase().includes(sportType.toLowerCase())) {
            foundSportTypes.push(sportType);
        }
    }
    return foundSportTypes;
};
//# sourceMappingURL=fetch-venues.js.map