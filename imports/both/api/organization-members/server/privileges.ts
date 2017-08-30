import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { OrganizationMembers } from '../organization-members';
import { userHasFullAccessToReferencedOrganization } from '../../organizations/privileges';

OrganizationMembers.allow({
  insert: userHasFullAccessToReferencedOrganization,
  update: userHasFullAccessToReferencedOrganization,
  remove: userHasFullAccessToReferencedOrganization,
});

// Allow to remove your own organization memberships
OrganizationMembers.allow({
  remove(userId, organizationMember) {
    return organizationMember.userId === userId;
  },
});

OrganizationMembers.helpers({
  editableBy(userId) {
    check(userId, String);
    return userHasFullAccessToReferencedOrganization(userId, this);
  },
});