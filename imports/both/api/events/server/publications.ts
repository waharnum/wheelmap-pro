import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Events } from '../events.js';
import { publishAndLog } from '../../../../server/publish';

// FIXME: add checking for access rights and visibility
publishAndLog('events.by_id', (_id: Mongo.ObjectID) => {
  return Events.find({_id});
});

// FIXME: add checking for access rights and visibility
publishAndLog('events.by_organizationId', (organizationId: Mongo.ObjectID) => {
  return Events.find({organizationId: { $in: [organizationId]}});
});
