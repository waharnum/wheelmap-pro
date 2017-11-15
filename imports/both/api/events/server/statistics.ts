import {Events, IEvent} from '../events';
import {EventParticipants, IEventParticipant} from '../../event-participants/event-participants';
import {IPlaceInfo, PlaceInfos} from '../../place-infos/place-infos';


function isParticipant(document: IEvent | IEventParticipant | IPlaceInfo): document is IEventParticipant {
  return (document as IEventParticipant).eventId !== undefined;
}

function isPlaceInfo(document: IEvent | IEventParticipant | IPlaceInfo): document is IPlaceInfo {
  return !!((document as IPlaceInfo).properties && (document as IPlaceInfo).properties.eventId !== undefined);
}

const buildStatistics = (document?: IEvent | IEventParticipant | IPlaceInfo | null) => {
  if (document && document._id) {
    let id: Mongo.ObjectID = document._id;
    if (isParticipant(document) && document.eventId) {
      id = document.eventId;
    } else if (isPlaceInfo(document) && document.properties.eventId) {
      id = document.properties.eventId;
    }

    // const start = Date.now();
    const fullParticipantCount = EventParticipants.find({eventId: id}).count();
    // const afterParticipants = Date.now();
    const acceptedParticipantCount = EventParticipants.find({eventId: id, invitationState: 'accepted'}).count();
    // const afterAcceptedParticipants = Date.now();
    const mappedPlacesCount = PlaceInfos.find({'properties.eventId': id}).count();
    // const afterEvents = Date.now();
    // console.log('times', afterParticipants - start, afterAcceptedParticipants - afterParticipants, afterEvents - afterAcceptedParticipants);

    // console.log('building event statistics', id);

    Events.update(id, {
      $set: {
        statistics: {
          fullParticipantCount,
          acceptedParticipantCount,
          mappedPlacesCount,
        },
      },
    });
  }
}

Meteor.startup(() => {
  let isStartup = true;

  Events.find({statistics: {$exists: false}}, {fields: {_id: 1}}).observe({
    added: (...args) => {
      if (isStartup) {
        buildStatistics(...args);
      }
    },
  });

  EventParticipants.find({}, {fields: {_id: 1, 'eventId': 1}}).observe({
    added: (...args) => {
      if (!isStartup) {
        buildStatistics(...args)
      }
    },
    changed: buildStatistics,
    removed: buildStatistics,
  });

  PlaceInfos.find({
    'properties.eventId': {$exists: true},
    'properties.creatorId': {$exists: true},
  }, {fields: {_id: 1, 'properties.eventId': 1}}).observe({
    added: (...args) => {
      if (!isStartup) {
        buildStatistics(...args)
      }
    },
    changed: buildStatistics,
    removed: buildStatistics,
  });
  isStartup = false;
});