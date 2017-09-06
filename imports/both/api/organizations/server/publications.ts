import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Organizations } from '../organizations.js';
import {publishAndLog} from '../../../../server/publish';

publishAndLog('organizations.public', () => {
  return Organizations.find();
});

publishAndLog('organizations.by_id.public', (_id: Mongo.ObjectID) => {
  return Organizations.find({_id});
});
