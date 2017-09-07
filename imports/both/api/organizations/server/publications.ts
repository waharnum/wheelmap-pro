import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Events } from '../../events/events';
import { Organizations } from '../organizations.js';
import { publishAndLog } from '../../../../server/publish';

publishAndLog('organizations.public', () => {
  return Organizations.find();
});

publishAndLog('organizations.by_id.public', (_id: Mongo.ObjectID) => {
  return Organizations.find({_id}, {limit: 1});
});

publishAndLog('organizations.by_eventId.public', (eventId: Mongo.ObjectID) => {
  const event = Events.findOne(eventId, {fields: {organizationId: 1}});
  const selector = event ? {_id: event.organizationId} : {_id: -1};
  return Organizations.find(selector, {limit: 1});
});