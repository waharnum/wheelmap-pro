import { pick } from 'lodash';
import SimpleSchema from 'simpl-schema';

interface ILocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

// Otherwise, validate everything and build the selector
const locationSchema = new SimpleSchema({
  latitude: {
    type: Number,
    min: -90,
    max: 90,
    decimal: true,
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180,
    decimal: true,
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 1000000, // 1000 km
    decimal: true,
  },
});

// Return a MongoDB document selector for a search by distance built
// with query parameters from given request.
export function distanceSearchSelector(req: { query: ILocation }) {
  const locationQuery = pick(req.query, 'latitude', 'longitude', 'accuracy') as ILocation;

  // If no location parameter is given, just return an empty selector
  if (!(locationQuery.latitude || locationQuery.longitude || locationQuery.accuracy)) {
    return {};
  }

  // Clean the data to remove whitespaces and have correct types
  locationSchema.clean(locationQuery);

  // Throw ValidationError if something is wrong
  locationSchema.validate(locationQuery);

  return {
    geometry: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          // FIXME: this needs to be latitude, longitude - no one does it any other way
          coordinates: [locationQuery.longitude, locationQuery.latitude],
        },
        $maxDistance: locationQuery.accuracy,
      },
    },
  };
}
