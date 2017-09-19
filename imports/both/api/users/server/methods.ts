import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {TAPi18n} from 'meteor/tap:i18n';
import {isAdmin} from '../../../lib/is-admin';
import {Accounts} from 'meteor/accounts-base';
import {EventParticipants} from '../../event-participants/event-participants';

Accounts.onCreateUser((options: any, user: Meteor.User) => {
  user.username = options.username || undefined;
  user.profile = user.profile || {};

  if (!user.username && user.emails && user.emails.length > 0) {
    user.username = user.emails[0].address;
  }

  return user;
});

Accounts.registerLoginHandler('guest', (options) => {
  if (!options.username) {
    return undefined; // don't handle
  }
  // TODO check username not in use yet

  const username = options.username;
  const user = {username, guest: true};
  const newUserId = Accounts.insertUserDoc(options, user);
  return {
    userId: newUserId,
  };
});

Accounts.onLogout((options: { user: Meteor.User }) => {
  // if a guest user logs out, their account is lost and can be deleted
  if (options.user && options.user.guest) {
    cleanupOldGuestProfiles();
  }
});

function cleanupOldGuestProfiles() {
  // find all users that logged out, but never connected with a real account
  const users = Meteor.users.find({'guest': true, 'services.resume.loginTokens': {$size: 0}},
    {fields: {_id: 1}}).fetch().map((u) => u._id);

  if (users.length > 0) {
    // do not delete users Meteor.users.remove({_id: {$in: users}});
    EventParticipants.update({userId: {$in: users}}, {
      // $unset: {userId: 1},
      $set: {invitationState: 'old-guest'},
    }, {multi: true});
  }
};

Meteor.methods({
  'users.updateActiveOrganization'(organizationId: Mongo.ObjectID) {
    if (!this.userId) {
      throw new Meteor.Error(401, TAPi18n.__('Please log in first.'));
    }
    check(organizationId, String);
    Meteor.users.update(this.userId, {$set: {'profile.activeOrganizationId': organizationId}});
  },
  'users.approve'(_id: Mongo.ObjectID) {
    check(_id, String);

    if (!this.userId) {
      throw new Meteor.Error(401, TAPi18n.__('Please log in first.'));
    }
    if (!isAdmin(this.userId)) {
      throw new Meteor.Error(403, TAPi18n.__('You are not authorized to approve users.'));
    }
    const user = Meteor.users.find({_id});
    if (!user) {
      throw new Meteor.Error(403, TAPi18n.__('Can not find user with this id.'));
    }
    Meteor.users.update({_id}, {$set: {isApproved: true}});
  },
  'users.remove'(_id: Mongo.ObjectID) {
    check(_id, String);

    if (!this.userId) {
      throw new Meteor.Error(401, TAPi18n.__('Please log in first.'));
    }
    if (!isAdmin(this.userId)) {
      throw new Meteor.Error(403, TAPi18n.__('You are not authorized to remove users.'));
    }
    const user = Meteor.users.find({_id});
    if (!user) {
      throw new Meteor.Error(403, TAPi18n.__('Can not find user with this id.'));
    }
    Meteor.users.remove({_id});
  },
});
