import {OrganizationsPublicFields} from '../../organizations/server/fields';
import {ActiveOrganizationForUserIdSelector, UserPublicFields, UserVisibleSelectorForUserIdSelector} from './fields';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

import {isAdmin} from '../../../lib/is-admin';
import {Organizations} from '../../organizations/organizations';
import {publishAndLog, publishFields} from '../../../../server/publish';

import './publish-user-is-admin-flag.ts';

const Users = Meteor.users as Mongo.Collection<Meteor.User>;

publishAndLog('users.needApproval.admin', () => {
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

publishFields('users.private', Users, UserPublicFields, UserVisibleSelectorForUserIdSelector);

publishAndLog('users.my.private', () => {
  if (!this.userId) {
    return [];
  }
  return Users.find(this.userId);
});

// publish my active organization
publishFields(
  'organizations.my.active.private',
  Organizations,
  OrganizationsPublicFields,
  ActiveOrganizationForUserIdSelector);
