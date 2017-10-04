import {IPlaceInfo, PlaceInfos} from '../place-infos';
import {Sources} from '../../sources/sources';
import {sampleSize} from 'lodash';
import {PlaceInfoPublicFields} from './privileges';

const MAX_ELIGIBLE_PLACE_INFO_ID_COUNT = 100000;

function getSourceIds() {
  return Sources.find(
    {isShownOnStartPage: true, isDraft: false},
    {fields: {_id: 1}, transform: undefined},
  ).fetch().map(source => source._id);
}

function getPlaceInfoIds() {
  const sourceIds = getSourceIds();
  if (sourceIds.length === 0) {
    return [];
  }
  const selector = {
    // TODO: For some reason, we have many PoIs named 'object'. Find out why.
    'properties.name': {$ne: 'object'},
    'properties.sourceId': {$in: sourceIds},
    'properties.accessibility.accessibleWith.wheelchair': true,
  };
  const options = {limit: MAX_ELIGIBLE_PLACE_INFO_ID_COUNT, transform: undefined, fields: {_id: 1}};
  return PlaceInfos.find(selector, options).fetch().map(placeInfo => placeInfo._id);
}

export default function pickRandomPlaceInfos(count): IPlaceInfo[] {
  const now = Date.now();
  const availableIds = getPlaceInfoIds();
  const pickedIds = sampleSize(availableIds, count);
  const selector = {_id: {$in: pickedIds}};
  const options = {transform: undefined, fields: PlaceInfoPublicFields};
  const placeInfos = PlaceInfos.find(selector, options).fetch();
  console.log(
    'Picked', pickedIds.length, 'random places from',
    availableIds.length, 'available places, needed', Date.now() - now, 'ms.',
  );
  return placeInfos;
}
