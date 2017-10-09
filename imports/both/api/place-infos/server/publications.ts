import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {PlaceInfos} from '../place-infos';
import {PlaceInfoPublicFields, PlaceInfoVisibleSelectorForUserId} from './privileges';

const options = {fields: PlaceInfoPublicFields};

// Publishing all placeInfos can be VERY slow.
// Meteor.publish('placeInfos.public', () => PlaceInfos.find({}, options));

Meteor.publish('placeInfosFromImport.public', (sourceImportId) => {
  check(sourceImportId, String);

  return PlaceInfos.find({'properties.sourceImportId': sourceImportId}, {limit: 3});
});

Meteor.publish('placeInfos.single', function publish(placeInfoId) {
  check(placeInfoId, String);
  const selector = {
    $and: [
      {_id: placeInfoId},
      PlaceInfoVisibleSelectorForUserId(this.userId),
    ],
  };
  return PlaceInfos.find(selector, options);
});