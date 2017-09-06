import { OrganizationsPublicFields } from '../../organizations/server/fields';
import { ActiveOrganizationForUserIdSelector, UserPublicFields, UserVisibleSelectorForUserIdSelector } from './fields';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { isAdmin } from '../../../lib/is-admin';
import {Organizations} from '../../organizations/organizations';
import {OrganizationVisibleForUserIdSelector} from '../../organization-members/server/fields';
import {publishAndLog, publishFields} from '../../../../server/publish';

import './publish-user-is-admin-flag.ts';

const Users = Meteor.users as Mongo.Collection<Meteor.User>;

publishAndLog('users.needApproval.admin', () => {
  if (!isAdmin(this.userId)) {
    return [];
  }
  return Meteor.users.find({ $or: [
    { isApproved: { $exists: false } },
    { isApproved: false },
  ] });
});

// even though typescript complains about Meteor.users, this is fine. Kind of.
// It is unclear why the SimplSchema addition is not applied here
publishFields('users.public', Users, UserPublicFields,  UserVisibleSelectorForUserIdSelector);

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
