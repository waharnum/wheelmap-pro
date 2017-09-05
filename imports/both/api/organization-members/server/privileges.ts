import { Meteor } from 'meteor/meteor';

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
