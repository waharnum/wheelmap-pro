import {check} from 'meteor/check';
import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {intersection} from 'lodash';

import {Events} from '../../events/events';
import {getOrganizationsMemberships, getOrganizationsWhereCurrentUserIsMember, Organizations} from '../organizations';
import {publishAndLog} from '../../../../server/publish';

publishAndLog('organizations.public', () => {
  return Organizations.find();
});

publishAndLog('organizations.private', () => {
  return getOrganizationsWhereCurrentUserIsMember();
});

publishAndLog('organizations.by_id.public', (_id: Mongo.ObjectID) => {
  // always sanitize to ensure no injection is possible from params (e.g. sending {$ne: -1} as an object)
  check(_id, String);

  return Organizations.find({_id}, {limit: 1});
});

publishAndLog('organizations.by_id.private', (_id: Mongo.ObjectID) => {
  // always sanitize to ensure no injection is possible from params (e.g. sending {$ne: -1} as an object)
  check(_id, String);

  const userId = Meteor.userId();
  const allowedIds = intersection(getOrganizationsMemberships(userId), [_id]);
  return Organizations.find({_id: {$in: allowedIds}}, {limit: 1});
});

publishAndLog('organizations.by_eventId.public', (eventId: Mongo.ObjectID) => {
  // always sanitize to ensure no injection is possible from params (e.g. sending {$ne: -1} as an object)
  check(eventId, String);

  const event = Events.findOne(eventId, {fields: {organizationId: 1}});
  const selector = event ? {_id: event.organizationId} : {_id: -1};
  return Organizations.find(selector, {limit: 1});
});
