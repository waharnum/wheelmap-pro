import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Events } from '../events.js';
import { publishAndLog } from '../../../../server/publish';

publishAndLog('events', () => {
  return Events.find();
});

publishAndLog('events.by_id', (_id: Mongo.ObjectID) => {
  return Events.find({_id});
});
