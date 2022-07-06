import HttpError from '../models/http-error';
import Venue, { IVenueDoc } from '../models/venue';
import BaseRepository from './base-repository';

class VenuesRepository extends BaseRepository<IVenueDoc> {
  constructor() {
    super(Venue);
  }
}

export default VenuesRepository;
