import {Meteor} from 'meteor/meteor';
import {TAPi18n} from 'meteor/tap:i18n';
import {isAdmin} from '../../../lib/is-admin';

Meteor.methods({
  'users.updateActiveOrganization'(organizationId: Mongo.ObjectID) {
    if (!this.userId) {
      throw new Meteor.Error(401, TAPi18n.__('Please log in first.'));
    }
    Meteor.users.update(this.userId, {$set: {'profile.activeOrganizationId': organizationId}});
  },
  'users.approve'(_id: Mongo.ObjectID) {
    if (!this.userId) {
      throw new Meteor.Error(401, TAPi18n.__('Please log in first.'));
    }
    if (!isAdmin(this.userId)) {
      throw new Meteor.Error(403, TAPi18n.__('You are not authorized to import categories.'));
    }
    const user = Meteor.users.find({_id});
    if (!user) {
      throw new Meteor.Error(403, TAPi18n.__('Can not find user with this id.'));
    }
    Meteor.users.update({_id}, {$set: {isApproved: true}});
  },
  'users.remove'(_id: Mongo.ObjectID) {
    if (!this.userId) {
      throw new Meteor.Error(401, TAPi18n.__('Please log in first.'));
    }
    if (!isAdmin(this.userId)) {
      throw new Meteor.Error(403, TAPi18n.__('You are not authorized to import categories.'));
    }
    const user = Meteor.users.find({_id});
    if (!user) {
      throw new Meteor.Error(403, TAPi18n.__('Can not find user with this id.'));
    }
    Meteor.users.remove({_id});
  },
});
