import {check} from 'meteor/check';

import {isAdmin} from '../../../lib/is-admin';
import {PlaceInfos} from '../place-infos';
import {Sources} from '../../sources/sources';
import {
  SourceVisibleSelectorForUserId,
} from '../../sources/server/privileges';

PlaceInfos.allow({
  insert: isAdmin,
  update: isAdmin,
  remove: isAdmin,
});

export const PlaceInfoPublicFields = {
  properties: 1,
  geometry: 1,
};

PlaceInfos.helpers({
  editableBy: isAdmin,
});

// returns a selector that matches all places that are belonging to sources matched by the given
// data source selector
function placeInfoSelectorForSourceSelector(sourceSelector) {
  check(sourceSelector, Object);
  // console.log('Including sources', JSON.stringify(sourceSelector));
  const options = {transform: undefined, fields: {_id: 1}};
  const sourceIds = Sources.find(sourceSelector, options).fetch().map(s => s._id);
  return {'properties.sourceId': {$in: sourceIds}};
}

export const PlaceInfoVisibleSelectorForUserId = (userId) => {
  if (!userId) {
    return null;
  }

  check(userId, String);
  return placeInfoSelectorForSourceSelector(SourceVisibleSelectorForUserId(userId));
};
