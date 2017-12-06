import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {PlaceInfos} from '../place-infos';
import {PlaceInfoPublicFields, PlaceInfoVisibleSelectorForUserId} from './privileges';
import {publishAndLog} from '../../../../server/publish';

const options = {fields: PlaceInfoPublicFields};

// Publishing all placeInfos will be VERY slow.

publishAndLog('placeInfosFromImport.public', (sourceImportId) => {
  check(sourceImportId, String);

  return PlaceInfos.find({'properties.sourceImportId': sourceImportId}, {limit: 3});
});

publishAndLog('placeInfos.single', function publish(placeInfoId) {
  check(placeInfoId, String);
  const selector = {
    $and: [
      {_id: placeInfoId},
      PlaceInfoVisibleSelectorForUserId(this.userId),
    ],
  };
  return PlaceInfos.find(selector, options);
});

publishAndLog('placeInfos.by_eventId.public', (eventId) => {
  check(eventId, String);
  return PlaceInfos.find({'properties.eventId': eventId}, {limit: 200});
});
