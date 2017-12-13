import {Meteor} from 'meteor/meteor';
import {PlaceInfos} from '../place-infos';

Meteor.startup(() => {
  PlaceInfos._ensureIndex({'properties.sourceId': 1});
  PlaceInfos._ensureIndex({'properties.sourceImportId': 1});
  PlaceInfos._ensureIndex({'properties.category': 1});
  PlaceInfos._ensureIndex({'properties.accessibility.accessibleWith.wheelchair': 1});
  PlaceInfos._ensureIndex({'properties.accessibility.partlyAccessibleWith.wheelchair': 1});
  PlaceInfos._ensureIndex({'properties.originalId': 1});
  PlaceInfos._ensureIndex({'properties.sourceId': 1, 'properties.originalId': 1});

  // by event
  PlaceInfos._ensureIndex({'properties.eventId': 1});
  // by creator
  PlaceInfos._ensureIndex({'properties.creatorId': 1});
  // contributions for a certain event
  PlaceInfos._ensureIndex({'properties.eventId': 1, 'properties.creatorId': 1});

  // Ensuring geospatial index for PlaceInfos...
  PlaceInfos._ensureIndex({geometry: '2dsphere'});
});
