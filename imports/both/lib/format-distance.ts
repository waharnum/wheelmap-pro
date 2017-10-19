import {t} from 'c-3po';


export function formatDistance(distanceInMeters: number): string {
  if (isNaN(distanceInMeters) || distanceInMeters < 0) {
    return t`Unknown Distance`;
  }

  // does not handle sub-centimeter units well
  if (distanceInMeters < 1.0) {
    const value = (distanceInMeters * 100).toFixed(0);
    return t`${ value } m`;
  }
  else if (distanceInMeters < 10.0) {
    const value = distanceInMeters.toFixed(1);
    return t`${ value } m`;
  }
  else if (distanceInMeters < 1000.0) {
    const value = distanceInMeters.toFixed(0);
    return t`${ value } m`;
  }
  else if (distanceInMeters < 10000.0) {
    const value = (distanceInMeters / 1000).toFixed(1);
    return t`${ value } km`;
  }
  else {
    const value = (distanceInMeters / 1000).toFixed(0);
    return t`${ value } km`;
  }
}
