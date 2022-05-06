import {NextFunction, Request, Response} from 'express';
import {fetchPlaygrounds, fetchSportFacilities} from '../util/fetch-venues';
import Venue, {IVenue} from '../models/venue';
import HttpError from '../models/http-error';

const getVenues = async (req: Request, res: Response, next: NextFunction) => {
    let venues;

    try {
        venues = await Venue.find().populate('comments');
    } catch (error) {
        return next(new HttpError('Something went wrong, could not find venues.', 500));
    }

    if (!venues) {
        return next(new HttpError('Could not get venues.', 404));
    }
    res.json({
        venues: venues.map(venue => venue.toObject({getters: true}))
    });
}

const getVenueById = async (req: Request, res: Response, next: NextFunction) => {
    const venueId = req.params.venueId;

    let venue;
    try {
        venue = await Venue.findById(venueId).populate('comments');
    } catch (e) {
        return next(new HttpError('Fetching venue failed, please try again later.', 500))
    }

    if (!venue) {
        return next(new HttpError('Could not find venue for provided id!', 404));
    }

    res.json({
        venue: venue.toObject({getters: true})
    });
}

const createVenues = async (req: Request, res: Response, next: NextFunction) => {

    const sportFacilities = await fetchSportFacilities();
    const playgrounds = await fetchPlaygrounds();

    const fetchedVenues: IVenue[] = [...sportFacilities, ...playgrounds]

    await Venue.insertMany(fetchedVenues);

    res.status(201).json({
        message: fetchedVenues.length + ' of Venues have been created.',
        createdVenues: fetchedVenues
    });
}

export {
    getVenues,
    getVenueById,
    createVenues
}