import * as leaflet from 'leaflet';

import {EventRegion} from '../api/events/events';

export function regionToBbox(region: EventRegion): leaflet.LatLngBounds {
  const tl = region.topLeft;
  const br = region.bottomRight;
  const corner1 = leaflet.latLng(tl.latitude, tl.longitude);
  const corner2 = leaflet.latLng(br.latitude, br.longitude);
  return leaflet.latLngBounds(corner1, corner2);
}

export function bboxToRegion(bbox: leaflet.LatLngBounds): EventRegion {
  const tl = bbox.getSouthWest();
  const br = bbox.getNorthEast();
  return {
    topLeft: {latitude: tl.lat, longitude: tl.lng},
    bottomRight: {latitude: br.lat, longitude: br.lng},
  };
}
