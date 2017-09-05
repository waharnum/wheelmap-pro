import { Meteor } from 'meteor/meteor';

import { EventParticipants } from '../event-participants';
import { publishAndLog } from '../../../../server/publish';

// FIXME: add checking for access rights
publishAndLog('eventParticipants.by_eventId', (eventId: Mongo.ObjectID) => {
  return EventParticipants.find({eventId: {$in: [eventId]}});
});
