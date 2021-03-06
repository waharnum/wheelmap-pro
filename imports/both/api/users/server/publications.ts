import {OrganizationsPublicFields} from '../../organizations/server/fields';
import {
  ActiveOrganizationForUserIdSelector,
  UserFieldsForOrganizationMembers,
  UserVisibleSelectorForUserIdSelector,
} from './fields';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

import {isAdmin} from '../../../lib/is-admin';
import {Organizations} from '../../organizations/organizations';
import {publishAndLog, publishFields} from '../../../../server/publish';

import './publish-user-is-admin-flag.ts';
import {EventParticipants} from '../../event-participants/event-participants';
import {OrganizationMembers} from '../../organization-members/organization-members';

const Users = Meteor.users as Mongo.Collection<Meteor.User>;

publishAndLog('users.needApproval.admin', function () {
  // do not convert into arrow function, otherwise this gets replaced
  if (!isAdmin(this.userId)) {
    return [];
  }
  return Meteor.users.find({
    $or: [
      {isApproved: {$exists: false}},
      {isApproved: false},
    ],
  });
});

publishFields('users.private', Users, UserFieldsForOrganizationMembers, UserVisibleSelectorForUserIdSelector);

publishAndLog('users.my.private', function () {
  // do not convert into arrow function, otherwise this gets replaced
  if (!this.userId) {
    return [];
  }

  // publish all user/role related values
  return [
    Users.find(this.userId),
    EventParticipants.find({userId: this.userId}),
    OrganizationMembers.find({userId: this.userId})];
});

// publish my active organization
publishFields(
  'organizations.my.active.private',
  Organizations,
  OrganizationsPublicFields,
  ActiveOrganizationForUserIdSelector);
