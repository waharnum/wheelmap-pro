import {throttle} from 'lodash';

import {Events} from '../events';
import {EventParticipants} from '../../event-participants/event-participants';
import {PlaceInfos} from '../../place-infos/place-infos';


export interface IEventStatistics {
  // mongo id
  _id?: Mongo.ObjectID;
  // fields
  eventId: Mongo.ObjectID;
};

export const EventStatistics = new Mongo.Collection<IEventStatistics>('EventStatistics');

const buildStatistics = () => {
  console.log('building event statistics');

}
const throttledStatistics = throttle(buildStatistics, 1000);

let isStartup = true;
Events.find({}, {fields: {_id: 1}}).observe({
  added: () => {
    if (!isStartup) {
      throttledStatistics()
    }
  },
  changed: throttledStatistics,
  removed: throttledStatistics,
});

EventParticipants.find({}, {fields: {_id: 1}}).observe({
  added: () => {
    if (!isStartup) {
      throttledStatistics()
    }
  },
  changed: throttledStatistics,
  removed: throttledStatistics,
});

PlaceInfos.find({}, {fields: {_id: 1}}).observe({
  added: () => {
    if (!isStartup) {
      throttledStatistics()
    }
  },
  changed: throttledStatistics,
  removed: throttledStatistics,
});
isStartup = false;
