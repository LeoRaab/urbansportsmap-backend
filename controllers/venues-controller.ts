import { NextFunction, Request, Response } from 'express';
import { fetchPlaygrounds, fetchSportFacilities } from '../util/fetch-venues';
import Venue, { IVenue, IVenueDoc } from '../models/venue';
import HttpError from '../models/http-error';
import VenuesRepository from '../repositories/venues-repository';
import MESSAGES from '../constants/messages';

const venuesRepository = new VenuesRepository();

const getVenues = async (req: Request, res: Response, next: NextFunction) => {
  const { result: venues, error } = await venuesRepository.readAll();

  if (error) {
    return next(error);
  }

  if (!venues) {
    return next(new HttpError(MESSAGES.NO_DATA_FOUND, 404));
  }

  res.json({
    venues: venues.map((venue: IVenueDoc) => venue.toObject({ getters: true })),
  });
};

const getVenueById = async (req: Request, res: Response, next: NextFunction) => {
  const venueId = req.params.venueId;

  const { result: venue, error } = await venuesRepository.readById(venueId);

  if (error) {
    return next(error);
  }

  if (!venue) {
    return next(new HttpError(MESSAGES.NO_DATA_FOUND, 500));
  }

  res.json({
    venue: venue.toObject({ getters: true }),
  });
};

const createVenues = async (req: Request, res: Response, next: NextFunction) => {
  const sportFacilities = await fetchSportFacilities();
  const playgrounds = await fetchPlaygrounds();

  const fetchedVenues: IVenue[] = [...sportFacilities, ...playgrounds];

  await Venue.insertMany(fetchedVenues);

  res.status(201).json({
    message: fetchedVenues.length + ' of Venues have been created.',
    createdVenues: fetchedVenues,
  });
};

export { getVenues, getVenueById, createVenues };
