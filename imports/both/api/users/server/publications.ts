import { OrganizationsPublicFields } from '../../organizations/server/fields';
import { ActiveOrganizationForUserIdSelector, UserPublicFields, UserVisibleSelectorForUserIdSelector } from './fields';
import { Meteor } from 'meteor/meteor';

import { isAdmin } from '../../../lib/is-admin';
import {Organizations} from '../../organizations/organizations';
import {OrganizationVisibleForUserIdSelector} from '../../organization-members/server/fields';
import {publishAndLog, publishPublicFields, publishPrivateFields} from '../../../../server/publish';

import './publish-user-is-admin-flag.ts';

publishAndLog('users.needApproval', () => {
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
publishPublicFields('users', Meteor.users, UserPublicFields, UserVisibleSelectorForUserIdSelector);

publishAndLog('users.my', () => {
  if (!this.userId) {
    return [];
  }

  return Meteor.users.find(this.userId);
});

// publish my active organization
publishPrivateFields(
  'organizations.my.active',
  Organizations,
  OrganizationsPublicFields,
  ActiveOrganizationForUserIdSelector);
