import SimpleSchema from 'simpl-schema';
import {pick} from 'lodash';

// Ported from Wheelmap source code
interface ILocationQuery {
  x: number;
  y: number;
  z: number;
}

function tile2latlon(x, y, z) {
  const n = Math.pow(2.0, z);
  const lonDeg = x / n * 360.0 - 180.0;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
  const latDeg = 180.0 * (latRad / Math.PI);
  return [Number(latDeg.toFixed(4)), Number(lonDeg.toFixed(4))];
}

function tile2GeoJSONPolygon({x, y, z}: ILocationQuery) {
  const [north, west] = tile2latlon(x, y, z);
  const [south, east] = tile2latlon(x + 1, y + 1, z);

  return {
    type: 'Polygon',
    coordinates: [[[east, north], [east, south], [west, south], [west, north], [east, north]]],
  };
}

const LocationQuerySchema = new SimpleSchema({
  y: {
    type: Number,
    min: 0,
    max: 1e10,
    decimal: false,
  },
  x: {
    type: Number,
    min: 0,
    max: 1e10,
    decimal: false,
  },
  z: {
    type: Number,
    min: 5,
    max: 18,
    decimal: false,
  },
});

// Return a MongoDB document selector for a search by distance built
// with query parameters from given request.

export function mapTileSelector(req) {
  const locationQuery = pick(req.query, 'x', 'y', 'z') as ILocationQuery;

  // If no location parameter is given, just return an empty selector
  if (!(locationQuery.x && locationQuery.y && locationQuery.z)) {
    return {};
  }

  // Otherwise, validate everything and build the selector

  // Clean the data to remove whitespaces and have correct types
  LocationQuerySchema.clean(locationQuery);

  // Throw ValidationError if something is wrong
  LocationQuerySchema.validate(locationQuery);

  return {
    geometry: {
      $geoWithin: {$geometry: tile2GeoJSONPolygon(locationQuery)},
    },
  };
}
