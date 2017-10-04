import {pick} from 'lodash';
import SimpleSchema from 'simpl-schema';

interface LocationRequest {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

const LocationSchema = new SimpleSchema({
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
export function distanceSearchSelector(req: any) {
  const locationQuery = pick(req.query, 'latitude', 'longitude', 'accuracy') as LocationRequest;

  // If no location parameter is given, just return an empty selector
  if (!(locationQuery.latitude && locationQuery.longitude && locationQuery.accuracy)) {
    return {};
  }

  // Otherwise, validate everything and build the selector

  // Clean the data to remove whitespaces and have correct types
  LocationSchema.clean(locationQuery);

  // Throw ValidationError if something is wrong
  LocationSchema.validate(locationQuery);

  return {
    geometry: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [locationQuery.longitude, locationQuery.latitude],
        },
        $maxDistance: locationQuery.accuracy,
      },
    },
  };
}
