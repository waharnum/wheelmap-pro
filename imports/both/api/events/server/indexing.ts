import { Meteor } from 'meteor/meteor';
import { Events } from '../events';

Meteor.startup(() => {
  Events._ensureIndex({ name: 1 });
  Events._ensureIndex({ organizationId: 1 });
});
