import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Organizations } from '../organizations.js';
import {publishAndLog} from '../../../../server/publish';

publishAndLog('organizations', () => {
  return Organizations.find();
});

publishAndLog('organizations.by_id', (_id: Mongo.ObjectID) => {
  return Organizations.find({_id});
});
