import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Organizations } from '../organizations.js';

Meteor.publish('organizations', () => {
  return Organizations.find();
});

Meteor.publish('organizations.by_id', (_id: Mongo.ObjectID) => {
  return Organizations.find({_id});
});
