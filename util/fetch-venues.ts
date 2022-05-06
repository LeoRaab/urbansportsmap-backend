import axios from 'axios';
import HttpError from '../models/http-error';
import {ALLOWED_SPORT_TYPES, SPORT_TYPE} from '../models/sport-type';
import {FeatureCollection, Point} from 'geojson';
import {IVenue} from '../models/venue';

const fetchSportFacilities = async (): Promise<IVenue[]> => {
    const response = await axios.get('https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPORTSTAETTENOGD&srsName=EPSG:4326&outputFormat=json');

    const data: FeatureCollection = response.data;

    if (!data) {
        throw new HttpError('Could not fetch Sport Facilities of Vienna', 404);
    }

    return data.features
        .filter(sportFacility => findSportTypes(sportFacility.properties!.SPORTSTAETTEN_ART).length > 0)
        .map(sportFacility => {
            const {properties, geometry} = sportFacility;
            const lat = (geometry as Point).coordinates[1];
            const lng = (geometry as Point).coordinates[0];

            return {
                name: clearSportFacilityName(properties!.ADRESSE),
                location: {
                    lat,
                    lng
                },
                sportTypes: findSportTypes(properties!.SPORTSTAETTEN_ART)
            }
        });
}

const fetchPlaygrounds = async (): Promise<IVenue[]> => {
    const response = await axios.get('https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPIELPLATZPUNKTOGD&srsName=EPSG:4326&outputFormat=json');

    const data: FeatureCollection = response.data;

    if (!data) {
        throw new HttpError('Could not fetch Playgrounds of Vienna', 404);
    }

    return data.features
        .filter(sportFacility => findSportTypes(sportFacility.properties!.SPIELPLATZ_DETAIL).length > 0)
        .map(sportFacility => {
            const {properties, geometry} = sportFacility;
            const lat = (geometry as Point).coordinates[1];
            const lng = (geometry as Point).coordinates[0];

            return {
                name: properties!.ANL_NAME,
                location: {
                    lat,
                    lng
                },
                sportTypes: findSportTypes(properties!.SPIELPLATZ_DETAIL)
            }
        });
}

const clearSportFacilityName = (sportFacilityText: string): string => {
    const splitText = sportFacilityText.split(',');
    let clearedName: string;

    if (splitText.length > 2) {
        clearedName = splitText[2];
    } else {
        clearedName = splitText[1];
    }

    const foundNumber = clearedName.search(/[0-9]/);

    if (foundNumber > -1) {
        clearedName = clearedName.substring(0, foundNumber);
    }

    return clearedName.trim();
}

const findSportTypes = (sportTypesText: string): SPORT_TYPE[] => {
    const foundSportTypes: SPORT_TYPE[] = [];

    for (const sportType of ALLOWED_SPORT_TYPES) {
        if (sportTypesText.toLowerCase().includes(sportType.toLowerCase())) {
            foundSportTypes.push(sportType);
        }
    }

    return foundSportTypes;
}

export {fetchSportFacilities, fetchPlaygrounds}